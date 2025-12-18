"use client"

import { useCallback } from "react"
import type { ReactElement } from "react"

type Role = "viewer" | "operator" | "admin"
type Action = "read" | "view" | "execute" | "restart" | "configure" | "deploy" | "manage"

const permissions: Record<Role, Action[]> = {
  viewer: ["read", "view"],
  operator: ["read", "view", "execute", "restart"],
  admin: ["read", "view", "execute", "restart", "configure", "deploy", "manage"],
}

export function useRBAC(userRole: Role = "viewer") {
  const can = useCallback(
    (action: Action) => {
      const userPermissions = permissions[userRole] || permissions.viewer
      return userPermissions.includes(action)
    },
    [userRole],
  )

  const withPermission = useCallback(
    (action: Action, component: ReactElement) => {
      return can(action) ? component : null
    },
    [can],
  )

  return {
    can,
    withPermission,
    currentRole: userRole,
  }
}
