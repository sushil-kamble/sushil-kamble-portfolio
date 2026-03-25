<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import TagInput from '$lib/components/admin/TagInput.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	const props = $props();

	let skills = $state<string[]>(props.data.career.skills ?? []);
	let detailsList = $state<string[]>(props.data.career.detailsList ?? []);

	let skillsJson = $derived(JSON.stringify(skills));
	let detailsListJson = $derived(JSON.stringify(detailsList));
</script>

<div class="form-page">
	<a href={resolve('/admin/careers')} class="back-link">
		<ArrowLeft size={16} />
		<span>Back to Careers</span>
	</a>

	<h1>Edit Career</h1>

	<form method="POST" use:enhance>
		<div class="form-grid">
			<div class="form-group full">
				<label for="company">Company</label>
				<input
					type="text"
					id="company"
					name="company"
					required
					placeholder="Company name"
					value={props.data.career.company}
				/>
			</div>

			<div class="form-group">
				<label for="designation">Designation</label>
				<input
					type="text"
					id="designation"
					name="designation"
					placeholder="e.g. Senior Engineer"
					value={props.data.career.designation}
				/>
			</div>

			<div class="form-group">
				<label for="location">Location</label>
				<input
					type="text"
					id="location"
					name="location"
					placeholder="e.g. Bengaluru, India"
					value={props.data.career.location}
				/>
			</div>

			<div class="form-group">
				<label for="start">Start</label>
				<input
					type="text"
					id="start"
					name="start"
					placeholder="e.g. Jan 2023"
					value={props.data.career.start}
				/>
			</div>

			<div class="form-group">
				<label for="end">End</label>
				<input
					type="text"
					id="end"
					name="end"
					placeholder="e.g. Present"
					value={props.data.career.end}
				/>
			</div>

			<div class="form-group full">
				<label for="details">Details</label>
				<textarea id="details" name="details" rows="3" placeholder="Brief description of the role"
					>{props.data.career.details}</textarea
				>
			</div>

			<div class="form-group full">
				<label for="detailsList-input">Details List</label>
				<TagInput
					tags={detailsList}
					placeholder="Add bullet point and press Enter..."
					onchange={(val) => (detailsList = val)}
				/>
				<input type="hidden" id="detailsList-input" name="detailsList" value={detailsListJson} />
			</div>

			<div class="form-group full">
				<label for="skills-input">Skills</label>
				<TagInput
					tags={skills}
					placeholder="Add skill and press Enter..."
					onchange={(val) => (skills = val)}
				/>
				<input type="hidden" id="skills-input" name="skills" value={skillsJson} />
			</div>

			<div class="form-group">
				<label for="logo">Logo URL</label>
				<input
					type="url"
					id="logo"
					name="logo"
					placeholder="https://..."
					value={props.data.career.logo}
				/>
			</div>

			<div class="form-group">
				<label for="link">Link URL</label>
				<input
					type="url"
					id="link"
					name="link"
					placeholder="https://..."
					value={props.data.career.link}
				/>
			</div>

			<div class="form-group">
				<label for="ordering">Ordering</label>
				<input type="number" id="ordering" name="ordering" value={props.data.career.ordering} />
			</div>
		</div>

		<div class="form-actions">
			<a href={resolve('/admin/careers')} class="cancel-btn">Cancel</a>
			<button type="submit" class="save-btn">Update Career</button>
		</div>
	</form>
</div>

<style>
	.form-page {
		max-width: 640px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 500;
		color: #888;
		text-decoration: none;
		margin-bottom: 16px;
		transition: color 0.15s;
	}

	.back-link:hover {
		color: #1a1a1a;
	}

	h1 {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 24px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full {
		grid-column: 1 / -1;
	}

	label {
		font-size: 13px;
		font-weight: 600;
		color: #555;
		margin-bottom: 6px;
	}

	input[type='text'],
	input[type='url'],
	input[type='number'],
	textarea {
		padding: 10px 14px;
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		background: #fafaf9;
		font-size: 14px;
		color: #1a1a1a;
		transition: all 0.2s;
		font-family: inherit;
		width: 100%;
		box-sizing: border-box;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #1a1a1a;
		background: white;
		box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
	}

	input::placeholder,
	textarea::placeholder {
		color: #aaa;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid #e8e5e0;
	}

	.cancel-btn {
		padding: 10px 20px;
		border: 1px solid #e0ddd8;
		border-radius: 10px;
		background: white;
		font-size: 13px;
		font-weight: 600;
		color: #666;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.15s;
		display: inline-flex;
		align-items: center;
	}

	.cancel-btn:hover {
		border-color: #ccc;
		color: #1a1a1a;
	}

	.save-btn {
		padding: 10px 24px;
		border: none;
		border-radius: 10px;
		background: #1a1a1a;
		color: white;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.save-btn:hover {
		background: #333;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 480px) {
		.form-grid {
			grid-template-columns: 1fr;
		}

		.form-group.full {
			grid-column: 1;
		}
	}
</style>
