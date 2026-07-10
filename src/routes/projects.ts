// Projects routes — spec section 1.7 "Gestão de Projetos"
// Organize API keys, consumption, and settings by project.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from './auth';

const projects = new Hono<{ Variables: { userId: string } }>();
projects.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));
projects.use('/*', authMiddleware as any);

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// ============================================================
// Types
// ============================================================
interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  key_count: number;
  requests_this_month: number;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

interface ProjectMember {
  project_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  role: 'viewer' | 'developer' | 'admin';
  status: 'active' | 'pending';
  created_at: string;
}

// ============================================================
// In-memory store
// ============================================================
const projectList: Project[] = [];
const projectMembers: ProjectMember[] = [];

// ============================================================
// GET /api/v1/projects — list user's projects
// ============================================================
projects.get('/', (c) => {
  const userId = c.get('userId');
  const owned = projectList.filter(p => p.owner_id === userId && !p.archived_at);
  const memberOf = projectMembers
    .filter(m => m.user_id === userId && m.status === 'active')
    .map(m => projectList.find(p => p.id === m.project_id))
    .filter(Boolean) as Project[];
  const all = [...owned, ...memberOf];
  return ok(c, [...new Map(all.map(p => [p.id, p])).values()]);
});

// ============================================================
// POST /api/v1/projects — create project
// ============================================================
projects.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');

  const project: Project = {
    id: 'proj-' + uuidv4().slice(0, 8),
    owner_id: userId,
    name: body.name,
    description: body.description || '',
    key_count: 0,
    requests_this_month: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    archived_at: null,
  };
  projectList.push(project);
  return c.json({ data: project }, 201);
});

// ============================================================
// GET /api/v1/projects/:id
// ============================================================
projects.get('/:id', (c) => {
  const userId = c.get('userId');
  const project = projectList.find(p => p.id === c.req.param('id') && p.owner_id === userId);
  if (!project) return bad(c, 'Project not found', 404);

  const members = projectMembers.filter(m => m.project_id === project.id);
  return ok(c, { ...project, members });
});

// ============================================================
// PATCH /api/v1/projects/:id
// ============================================================
projects.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const project = projectList.find(p => p.id === c.req.param('id') && p.owner_id === userId);
  if (!project) return bad(c, 'Project not found', 404);

  const body = await c.req.json().catch(() => ({}));
  if (body.name !== undefined) project.name = body.name;
  if (body.description !== undefined) project.description = body.description;
  project.updated_at = new Date().toISOString();
  return ok(c, project);
});

// ============================================================
// DELETE /api/v1/projects/:id — archive (soft delete)
// ============================================================
projects.delete('/:id', (c) => {
  const userId = c.get('userId');
  const project = projectList.find(p => p.id === c.req.param('id') && p.owner_id === userId);
  if (!project) return bad(c, 'Project not found', 404);

  project.archived_at = new Date().toISOString();
  project.updated_at = new Date().toISOString();
  return ok(c, { deleted: true, project_id: project.id });
});

// ============================================================
// POST /api/v1/projects/:id/members — invite member
// ============================================================
projects.post('/:id/members', async (c) => {
  const userId = c.get('userId');
  const project = projectList.find(p => p.id === c.req.param('id') && p.owner_id === userId);
  if (!project) return bad(c, 'Project not found', 404);

  const body = await c.req.json().catch(() => ({}));
  if (!body.email) return bad(c, 'email is required');

  const member: ProjectMember = {
    project_id: project.id,
    user_id: 'pending-' + uuidv4().slice(0, 8),
    user_name: body.email.split('@')[0],
    user_email: body.email,
    role: body.role || 'developer',
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  projectMembers.push(member);
  return c.json({ data: member }, 201);
});

// ============================================================
// DELETE /api/v1/projects/:id/members/:userId
// ============================================================
projects.delete('/:id/members/:userId', (c) => {
  const userId = c.get('userId');
  const project = projectList.find(p => p.id === c.req.param('id') && p.owner_id === userId);
  if (!project) return bad(c, 'Project not found', 404);

  const idx = projectMembers.findIndex(m =>
    m.project_id === project.id && m.user_id === c.req.param('userId')
  );
  if (idx === -1) return bad(c, 'Member not found', 404);
  projectMembers.splice(idx, 1);
  return ok(c, { deleted: true });
});

export default projects;
