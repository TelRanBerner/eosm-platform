export const isAdmin = (user) => {
    return user.role === 'admin';
}

export const isSupport = (user) => {
    return user.role === 'support';
}

export const isEngineer = (user) => {
    return user.role === 'engineer';
}

export const isUser = (user) => {
    return user.role === 'user';
}

export default { isAdmin, isSupport, isEngineer, isUser };