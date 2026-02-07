import type { PageData as PortfolioData } from '$lib/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface PageData extends PortfolioData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
