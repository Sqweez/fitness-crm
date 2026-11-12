export const canManageTrainers = user => !!user && user.roles.some(role => [1, 2].includes(role.id));
