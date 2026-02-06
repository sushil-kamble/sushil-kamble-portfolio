# Notion API Integration Reference

> **Purpose**: This document provides a complete reference for replicating the Notion API integration in a new project. It is LLM-friendly and contains all IDs, schemas, and patterns needed.

---

## Environment Variables

```env
INTEGRATION_TOKEN=<your_notion_internal_integration_token>
BASE_URL=https://api.notion.com/v1
```

---

## Axios Client Setup

Create an Axios instance with Notion headers:

```typescript
import axios, { type AxiosInstance } from 'axios';

export const useAxios = (header: Record<string, string> | null = null): AxiosInstance => {
	return axios.create({
		baseURL: process.env.BASE_URL,
		headers: {
			Authorization: 'Bearer ' + process.env.INTEGRATION_TOKEN,
			'Notion-Version': '2022-06-28',
			...(header || {})
		}
	});
};
```

---

## Notion Resource IDs

| Resource | Type     | ID                                 |
| -------- | -------- | ---------------------------------- |
| About Me | Block    | `bf58048fe08343169150555224cf344d` |
| Careers  | Database | `94c276962ca049e48cc291faf624b5e1` |
| Skills   | Database | `1da77e9a57504380adb46b899fc54551` |
| Projects | Database | `0c5b1a1234f4404b89bf0b71b9a06bd7` |
| Blogs    | Database | `106fce9b3e304e28a7c38c1856e27501` |

---

## API Endpoints Used

### 1. About Me (Block Children)

```
GET /blocks/{block_id}/children
```

- **Block ID**: `bf58048fe08343169150555224cf344d`
- **Response Path**: `results[0].paragraph.rich_text[0].plain_text`

### 2. Database Queries

```
POST /databases/{database_id}/query
```

---

## Data Schemas

### Careers Database

| Property       | Notion Type    | Output Type |
| -------------- | -------------- | ----------- |
| `company`      | `title`        | `string`    |
| `start`        | `rich_text`    | `string`    |
| `end`          | `rich_text`    | `string`    |
| `logo`         | `rich_text`    | `string`    |
| `link`         | `rich_text`    | `string`    |
| `location`     | `rich_text`    | `string`    |
| `designation`  | `rich_text`    | `string`    |
| `details`      | `rich_text`    | `string`    |
| `skills`       | `multi_select` | `string[]`  |
| `details-list` | `multi_select` | `string[]`  |

**Sort**: `ID` ascending

---

### Skills Database

| Property | Notion Type    | Output Type |
| -------- | -------------- | ----------- |
| `title`  | `title`        | `string`    |
| `skills` | `multi_select` | `string[]`  |

**Sort**: `id` ascending

---

### Projects Database

| Property      | Notion Type    | Output Type |
| ------------- | -------------- | ----------- |
| `title`       | `title`        | `string`    |
| `stack`       | `multi_select` | `string[]`  |
| `features`    | `multi_select` | `string[]`  |
| `screenshots` | `multi_select` | `string[]`  |
| `direct`      | `url`          | `string`    |
| `github`      | `url`          | `string`    |
| `description` | `rich_text`    | `string`    |

**Sort**: `ordering` ascending  
**Home Page Limit**: 5

---

### Blogs Database

| Property      | Notion Type    | Output Type |
| ------------- | -------------- | ----------- |
| `title`       | `title`        | `string`    |
| `description` | `rich_text`    | `string`    |
| `tags`        | `multi_select` | `string[]`  |
| `blog`        | `url`          | `string`    |
| `github`      | `url`          | `string`    |
| `live`        | `url`          | `string`    |

**Sort**: `ordering` ascending  
**Home Page Limit**: 3

---

## TypeScript Interfaces

```typescript
interface Career {
	id: string;
	company: string;
	start: string;
	end: string;
	location: string;
	designation: string;
	link: string;
	logo: string;
	details: string;
	skills: string[];
	detailsList: string[];
}

interface Project {
	id: string;
	title: string;
	stack: string[];
	features: string[];
	screenshots: string[];
	direct: string;
	github: string;
	description: string;
}

interface Skill {
	id: string;
	title: string;
	skills: string[];
}

interface Blog {
	id: string;
	title: string;
	description: string;
	tags: string[];
	blog: string;
	github: string;
	live: string;
}

interface PageData {
	about_me: string;
	careers: Career[];
	projects: Project[];
	skills: Skill[];
	blogs: Blog[];
}
```

---

## Data Extraction Patterns

### Extracting `title` property:

```typescript
item.properties.title.title[0].plain_text;
```

### Extracting `rich_text` property:

```typescript
item.properties.fieldName?.rich_text?.[0]?.plain_text || '';
```

### Extracting `multi_select` property:

```typescript
item.properties.fieldName?.multi_select?.map((i: any) => i.name) || [];
```

### Extracting `url` property:

```typescript
item.properties.fieldName?.url || '';
```

---

## Query Request Body Examples

### Basic Query with Sort:

```json
{
	"sorts": [{ "property": "ordering", "direction": "ascending" }]
}
```

### Query with Page Size Limit:

```json
{
	"page_size": 5,
	"sorts": [{ "property": "ordering", "direction": "ascending" }]
}
```

---

## File Structure Reference

```
src/
├── axios.ts          # Axios client with Notion auth headers
├── app.d.ts          # TypeScript interfaces for PageData
└── routes/
    ├── +page.server.ts       # Main page: fetches all data
    ├── blogs/
    │   └── +page.server.ts   # Blogs page: fetches all blogs
    └── projects/
        └── +page.server.ts   # Projects page: fetches all projects
```

---

## Quick Start Checklist

1. [ ] Set `INTEGRATION_TOKEN` in environment
2. [ ] Set `BASE_URL=https://api.notion.com/v1`
3. [ ] Install `axios` package
4. [ ] Create axios client with Notion headers (including `Notion-Version: 2022-06-28`)
5. [ ] Copy database/block IDs from table above
6. [ ] Use TypeScript interfaces for type safety
7. [ ] Apply data extraction patterns to map Notion response to app types
