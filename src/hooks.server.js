// src/hooks.js
import { loading } from './lib/loading';

export async function handle({ event, resolve }) {
	loading.set(true);

	const response = await resolve(event);

	loading.set(false);

	return response;
}
