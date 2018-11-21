exports.requireRole = user => roles => {
	const error = user
		? Array.isArray(roles)
			? !roles.includes(user.role)
			: roles !== user.role
		: true

	if (error) { throw new Error('Не достаточно прав для данного аккаунта') }
}