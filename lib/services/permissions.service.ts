export interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete" | "execute" | "admin"
}

export interface Role {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}

export interface UserPermissions {
  userId: string
  roles: string[]
  customPermissions: Permission[]
}

export class PermissionsService {
  private roles: Map<string, Role> = new Map()
  private userPermissions: Map<string, UserPermissions> = new Map()

  constructor() {
    // Initialize default roles
    this.createRole({
      id: "admin",
      name: "Administrator",
      permissions: [{ resource: "*", action: "admin" }],
      description: "Full system access",
    })

    this.createRole({
      id: "developer",
      name: "Developer",
      permissions: [
        { resource: "agents", action: "create" },
        { resource: "agents", action: "read" },
        { resource: "agents", action: "update" },
        { resource: "workflows", action: "create" },
        { resource: "workflows", action: "execute" },
      ],
      description: "Can create and manage agents and workflows",
    })

    this.createRole({
      id: "viewer",
      name: "Viewer",
      permissions: [
        { resource: "agents", action: "read" },
        { resource: "workflows", action: "read" },
        { resource: "dashboards", action: "read" },
      ],
      description: "Read-only access",
    })
  }

  createRole(role: Role): void {
    this.roles.set(role.id, role)
  }

  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId)
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values())
  }

  assignRole(userId: string, roleId: string): void {
    let userPerms = this.userPermissions.get(userId)
    if (!userPerms) {
      userPerms = { userId, roles: [], customPermissions: [] }
      this.userPermissions.set(userId, userPerms)
    }
    if (!userPerms.roles.includes(roleId)) {
      userPerms.roles.push(roleId)
    }
  }

  revokeRole(userId: string, roleId: string): void {
    const userPerms = this.userPermissions.get(userId)
    if (userPerms) {
      userPerms.roles = userPerms.roles.filter((r) => r !== roleId)
    }
  }

  hasPermission(userId: string, resource: string, action: string): boolean {
    const userPerms = this.userPermissions.get(userId)
    if (!userPerms) return false

    // Check custom permissions
    if (
      userPerms.customPermissions.some(
        (p) => (p.resource === resource || p.resource === "*") && (p.action === action || p.action === "admin"),
      )
    ) {
      return true
    }

    // Check role permissions
    for (const roleId of userPerms.roles) {
      const role = this.roles.get(roleId)
      if (
        role?.permissions.some(
          (p) => (p.resource === resource || p.resource === "*") && (p.action === action || p.action === "admin"),
        )
      ) {
        return true
      }
    }

    return false
  }

  getUserPermissions(userId: string): UserPermissions | undefined {
    return this.userPermissions.get(userId)
  }
}

export const permissionsService = new PermissionsService()
