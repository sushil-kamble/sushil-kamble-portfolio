import type { PageData as PortfolioData } from '$lib/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData extends PortfolioData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
