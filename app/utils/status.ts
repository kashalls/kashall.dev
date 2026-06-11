export interface StatusMeta {
	title: string
	description: string
}

const STATUS: Record<number, StatusMeta> = {
	400: { title: 'Bad Request', description: "That request doesn't look quite right. Head back and try again." },
	401: { title: 'Unauthorized', description: 'This page needs a fancy authorization token — or yours is invalid.' },
	403: { title: 'Forbidden', description: "Looks like you shouldn't be here anyway." },
	404: { title: 'Not Found', description: "The page you're looking for packed up and left. Check the URL, or head home." },
	418: { title: "I'm a teapot", description: 'I cannot brew coffee, for I am, in fact, a teapot.' },
	429: { title: 'Too Many Requests', description: 'Whoa there — slow down a moment, then give it another go.' },
	500: { title: 'Internal Server Error', description: "It's not you, it's me. If you think this is a bug, reach out." },
	502: { title: 'Bad Gateway', description: 'The upstream server handed me something I could not use.' },
	503: { title: 'Service Unavailable', description: 'This service is taking a quick nap. Try again shortly.' },
	504: { title: 'Gateway Timeout', description: 'Waited around for an upstream response that never arrived.' },
}

export function statusMeta(code?: number | string): StatusMeta & { code: number } {
	const c = Number(code) || 500
	return { code: c, ...(STATUS[c] ?? { title: 'Unknown Error', description: 'Something went sideways. Try heading home.' }) }
}
