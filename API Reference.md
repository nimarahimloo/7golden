    # API Reference

**Base URL:** `https://7-golden.base44.app/api`

## Setup

```bash
npm install @base44/sdk
```

```javascript
import { createClient } from '@base44/sdk';

const base44 = createClient({
  appId: "6a9ea5d67a95141fb1f84b4a",
  headers: {
    "api_key": "bee2608627f746d0b6f0c07a8bf421b5"
  }
});
```

## Award

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title_fa` | string | Yes | Persian title of license/award |
| `title_en` | string | Yes | English title of license/award |
| `desc_fa` | string |  | Persian description |
| `desc_en` | string |  | English description |
| `image` | string | Yes | Image URL of the license/award |
| `sort_order` | number |  |  |
| `published` | boolean |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/Award`
List Award records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.Award.list();
```

### `POST /entities/Award`
Create a Award record

```javascript
const record = await base44.entities.Award.create({
  // your data
});
```

### `DELETE /entities/Award`
Delete multiple Award records

```javascript
await base44.entities.Award.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  title_fa: "Example title_fa"
});
```

### `POST /entities/Award/bulk`
Bulk create Award records

```javascript
const records = await base44.entities.Award.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/Award/bulk`
Bulk update Award records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/Award/update-many`
Update many Award records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/Award/{Award_id}`
Get a Award record by ID

**Parameters:**
- `Award_id` (path): Record ID

```javascript
const record = await base44.entities.Award.get(recordId);
```

### `PUT /entities/Award/{Award_id}`
Update a Award record

**Parameters:**
- `Award_id` (path): Record ID

```javascript
const record = await base44.entities.Award.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/Award/{Award_id}`
Delete a Award record

**Parameters:**
- `Award_id` (path): Record ID

```javascript
await base44.entities.Award.delete(recordId);
```

### `PUT /entities/Award/{Award_id}/restore`
Restore a deleted Award record

**Parameters:**
- `Award_id` (path): Record ID

```javascript
const record = await base44.entities.Award.restore(recordId);
```

## Testimonial

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name_fa` | string | Yes |  |
| `name_en` | string | Yes |  |
| `role_fa` | string |  |  |
| `role_en` | string |  |  |
| `text_fa` | string | Yes |  |
| `text_en` | string | Yes |  |
| `rating` | number |  |  |
| `sort_order` | number |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/Testimonial`
List Testimonial records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.Testimonial.list();
```

### `POST /entities/Testimonial`
Create a Testimonial record

```javascript
const record = await base44.entities.Testimonial.create({
  // your data
});
```

### `DELETE /entities/Testimonial`
Delete multiple Testimonial records

```javascript
await base44.entities.Testimonial.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  name_fa: "Example name_fa"
});
```

### `POST /entities/Testimonial/bulk`
Bulk create Testimonial records

```javascript
const records = await base44.entities.Testimonial.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/Testimonial/bulk`
Bulk update Testimonial records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/Testimonial/update-many`
Update many Testimonial records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/Testimonial/{Testimonial_id}`
Get a Testimonial record by ID

**Parameters:**
- `Testimonial_id` (path): Record ID

```javascript
const record = await base44.entities.Testimonial.get(recordId);
```

### `PUT /entities/Testimonial/{Testimonial_id}`
Update a Testimonial record

**Parameters:**
- `Testimonial_id` (path): Record ID

```javascript
const record = await base44.entities.Testimonial.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/Testimonial/{Testimonial_id}`
Delete a Testimonial record

**Parameters:**
- `Testimonial_id` (path): Record ID

```javascript
await base44.entities.Testimonial.delete(recordId);
```

### `PUT /entities/Testimonial/{Testimonial_id}/restore`
Restore a deleted Testimonial record

**Parameters:**
- `Testimonial_id` (path): Record ID

```javascript
const record = await base44.entities.Testimonial.restore(recordId);
```

## Category

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | Yes |  |
| `name_fa` | string | Yes |  |
| `name_en` | string | Yes |  |
| `desc_fa` | string |  |  |
| `desc_en` | string |  |  |
| `image` | string | Yes |  |
| `sort_order` | number |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/Category`
List Category records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.Category.list();
```

### `POST /entities/Category`
Create a Category record

```javascript
const record = await base44.entities.Category.create({
  // your data
});
```

### `DELETE /entities/Category`
Delete multiple Category records

```javascript
await base44.entities.Category.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  slug: "Example slug"
});
```

### `POST /entities/Category/bulk`
Bulk create Category records

```javascript
const records = await base44.entities.Category.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/Category/bulk`
Bulk update Category records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/Category/update-many`
Update many Category records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/Category/{Category_id}`
Get a Category record by ID

**Parameters:**
- `Category_id` (path): Record ID

```javascript
const record = await base44.entities.Category.get(recordId);
```

### `PUT /entities/Category/{Category_id}`
Update a Category record

**Parameters:**
- `Category_id` (path): Record ID

```javascript
const record = await base44.entities.Category.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/Category/{Category_id}`
Delete a Category record

**Parameters:**
- `Category_id` (path): Record ID

```javascript
await base44.entities.Category.delete(recordId);
```

### `PUT /entities/Category/{Category_id}/restore`
Restore a deleted Category record

**Parameters:**
- `Category_id` (path): Record ID

```javascript
const record = await base44.entities.Category.restore(recordId);
```

## BlogPost

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | Yes |  |
| `title_fa` | string | Yes |  |
| `title_en` | string | Yes |  |
| `excerpt_fa` | string |  |  |
| `excerpt_en` | string |  |  |
| `content` | string |  | Full article body (markdown or html) |
| `date_fa` | string |  |  |
| `date_en` | string |  |  |
| `category` | string |  | news, education, etc. |
| `image` | string | Yes |  |
| `published` | boolean |  |  |
| `sort_order` | number |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/BlogPost`
List BlogPost records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.BlogPost.list();
```

### `POST /entities/BlogPost`
Create a BlogPost record

```javascript
const record = await base44.entities.BlogPost.create({
  // your data
});
```

### `DELETE /entities/BlogPost`
Delete multiple BlogPost records

```javascript
await base44.entities.BlogPost.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  slug: "Example slug"
});
```

### `POST /entities/BlogPost/bulk`
Bulk create BlogPost records

```javascript
const records = await base44.entities.BlogPost.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/BlogPost/bulk`
Bulk update BlogPost records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/BlogPost/update-many`
Update many BlogPost records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/BlogPost/{BlogPost_id}`
Get a BlogPost record by ID

**Parameters:**
- `BlogPost_id` (path): Record ID

```javascript
const record = await base44.entities.BlogPost.get(recordId);
```

### `PUT /entities/BlogPost/{BlogPost_id}`
Update a BlogPost record

**Parameters:**
- `BlogPost_id` (path): Record ID

```javascript
const record = await base44.entities.BlogPost.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/BlogPost/{BlogPost_id}`
Delete a BlogPost record

**Parameters:**
- `BlogPost_id` (path): Record ID

```javascript
await base44.entities.BlogPost.delete(recordId);
```

### `PUT /entities/BlogPost/{BlogPost_id}/restore`
Restore a deleted BlogPost record

**Parameters:**
- `BlogPost_id` (path): Record ID

```javascript
const record = await base44.entities.BlogPost.restore(recordId);
```

## SiteSettings

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `site_name_fa` | string | Yes |  |
| `site_name_en` | string | Yes |  |
| `site_mode` | `store`, `corporate` |  | Site mode: store (e-commerce with prices/cart) or corporate (showcase only, no prices) |
| `default_seo_title_fa` | string |  |  |
| `default_seo_title_en` | string |  |  |
| `default_seo_desc_fa` | string |  |  |
| `default_seo_desc_en` | string |  |  |
| `og_image` | string |  |  |
| `logo_url` | string |  |  |
| `contact_phone` | string |  |  |
| `contact_mobile` | string |  |  |
| `contact_email` | string |  |  |
| `hq_address_fa` | string |  |  |
| `hq_address_en` | string |  |  |
| `tehran_address_fa` | string |  |  |
| `tehran_address_en` | string |  |  |
| `working_hours_fa` | string |  |  |
| `working_hours_en` | string |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/SiteSettings`
List SiteSettings records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.SiteSettings.list();
```

### `POST /entities/SiteSettings`
Create a SiteSettings record

```javascript
const record = await base44.entities.SiteSettings.create({
  // your data
});
```

### `DELETE /entities/SiteSettings`
Delete multiple SiteSettings records

```javascript
await base44.entities.SiteSettings.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  site_name_fa: "Example site_name_fa"
});
```

### `POST /entities/SiteSettings/bulk`
Bulk create SiteSettings records

```javascript
const records = await base44.entities.SiteSettings.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/SiteSettings/bulk`
Bulk update SiteSettings records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/SiteSettings/update-many`
Update many SiteSettings records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/SiteSettings/{SiteSettings_id}`
Get a SiteSettings record by ID

**Parameters:**
- `SiteSettings_id` (path): Record ID

```javascript
const record = await base44.entities.SiteSettings.get(recordId);
```

### `PUT /entities/SiteSettings/{SiteSettings_id}`
Update a SiteSettings record

**Parameters:**
- `SiteSettings_id` (path): Record ID

```javascript
const record = await base44.entities.SiteSettings.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/SiteSettings/{SiteSettings_id}`
Delete a SiteSettings record

**Parameters:**
- `SiteSettings_id` (path): Record ID

```javascript
await base44.entities.SiteSettings.delete(recordId);
```

### `PUT /entities/SiteSettings/{SiteSettings_id}/restore`
Restore a deleted SiteSettings record

**Parameters:**
- `SiteSettings_id` (path): Record ID

```javascript
const record = await base44.entities.SiteSettings.restore(recordId);
```

## Product

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | Yes | URL-friendly identifier, e.g. hazelnut-paste |
| `name_fa` | string | Yes |  |
| `name_en` | string | Yes |  |
| `desc_fa` | string |  |  |
| `desc_en` | string |  |  |
| `category` | string | Yes | Category slug: hazelnut, pistachio, almond |
| `origin_fa` | string |  |  |
| `origin_en` | string |  |  |
| `price` | number | Yes | Price in IRR per kg |
| `price_display` | string |  | Pre-formatted Persian numeral price string |
| `image` | string | Yes | Primary image URL |
| `gallery` | array |  | Additional image URLs |
| `badge` | string |  | Persian badge label, null if none |
| `badge_en` | string |  | English badge label, null if none |
| `taste` | object |  | Taste profile percentages 0-100 |
| `weights` | array |  | Available weights in grams |
| `in_stock` | boolean |  |  |
| `featured` | boolean |  |  |
| `published` | boolean |  | Whether the product is visible on the public storefront |
| `sort_order` | number |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/Product`
List Product records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.Product.list();
```

### `POST /entities/Product`
Create a Product record

```javascript
const record = await base44.entities.Product.create({
  // your data
});
```

### `DELETE /entities/Product`
Delete multiple Product records

```javascript
await base44.entities.Product.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  slug: "Example slug"
});
```

### `POST /entities/Product/bulk`
Bulk create Product records

```javascript
const records = await base44.entities.Product.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/Product/bulk`
Bulk update Product records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/Product/update-many`
Update many Product records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/Product/{Product_id}`
Get a Product record by ID

**Parameters:**
- `Product_id` (path): Record ID

```javascript
const record = await base44.entities.Product.get(recordId);
```

### `PUT /entities/Product/{Product_id}`
Update a Product record

**Parameters:**
- `Product_id` (path): Record ID

```javascript
const record = await base44.entities.Product.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/Product/{Product_id}`
Delete a Product record

**Parameters:**
- `Product_id` (path): Record ID

```javascript
await base44.entities.Product.delete(recordId);
```

### `PUT /entities/Product/{Product_id}/restore`
Restore a deleted Product record

**Parameters:**
- `Product_id` (path): Record ID

```javascript
const record = await base44.entities.Product.restore(recordId);
```

## GalleryImage

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title_fa` | string | Yes | Persian title for the gallery image |
| `title_en` | string | Yes | English title for the gallery image |
| `desc_fa` | string |  | Persian caption/description |
| `desc_en` | string |  | English caption/description |
| `image` | string | Yes | Image URL |
| `span` | `tall`, `wide`, `normal` |  | Masonry layout sizing hint |
| `sort_order` | number |  |  |
| `published` | boolean |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/GalleryImage`
List GalleryImage records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.GalleryImage.list();
```

### `POST /entities/GalleryImage`
Create a GalleryImage record

```javascript
const record = await base44.entities.GalleryImage.create({
  // your data
});
```

### `DELETE /entities/GalleryImage`
Delete multiple GalleryImage records

```javascript
await base44.entities.GalleryImage.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  title_fa: "Example title_fa"
});
```

### `POST /entities/GalleryImage/bulk`
Bulk create GalleryImage records

```javascript
const records = await base44.entities.GalleryImage.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/GalleryImage/bulk`
Bulk update GalleryImage records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/GalleryImage/update-many`
Update many GalleryImage records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/GalleryImage/{GalleryImage_id}`
Get a GalleryImage record by ID

**Parameters:**
- `GalleryImage_id` (path): Record ID

```javascript
const record = await base44.entities.GalleryImage.get(recordId);
```

### `PUT /entities/GalleryImage/{GalleryImage_id}`
Update a GalleryImage record

**Parameters:**
- `GalleryImage_id` (path): Record ID

```javascript
const record = await base44.entities.GalleryImage.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/GalleryImage/{GalleryImage_id}`
Delete a GalleryImage record

**Parameters:**
- `GalleryImage_id` (path): Record ID

```javascript
await base44.entities.GalleryImage.delete(recordId);
```

### `PUT /entities/GalleryImage/{GalleryImage_id}/restore`
Restore a deleted GalleryImage record

**Parameters:**
- `GalleryImage_id` (path): Record ID

```javascript
const record = await base44.entities.GalleryImage.restore(recordId);
```

## ContactMessage

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes |  |
| `phone` | string |  |  |
| `email` | string |  |  |
| `message` | string | Yes |  |
| `status` | `new`, `read`, `replied` |  |  |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/ContactMessage`
List ContactMessage records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.ContactMessage.list();
```

### `POST /entities/ContactMessage`
Create a ContactMessage record

```javascript
const record = await base44.entities.ContactMessage.create({
  // your data
});
```

### `DELETE /entities/ContactMessage`
Delete multiple ContactMessage records

```javascript
await base44.entities.ContactMessage.deleteMany({
  // query filter — WARNING: empty {} deletes ALL records
  name: "Example name"
});
```

### `POST /entities/ContactMessage/bulk`
Bulk create ContactMessage records

```javascript
const records = await base44.entities.ContactMessage.bulkCreate([
  { /* record 1 */ },
  { /* record 2 */ },
]);
```

### `PUT /entities/ContactMessage/bulk`
Bulk update ContactMessage records

```javascript
// bulk-update is not available via SDK — use the REST API
```

### `PATCH /entities/ContactMessage/update-many`
Update many ContactMessage records by query

```javascript
// update-many is not available via SDK — use the REST API
```

### `GET /entities/ContactMessage/{ContactMessage_id}`
Get a ContactMessage record by ID

**Parameters:**
- `ContactMessage_id` (path): Record ID

```javascript
const record = await base44.entities.ContactMessage.get(recordId);
```

### `PUT /entities/ContactMessage/{ContactMessage_id}`
Update a ContactMessage record

**Parameters:**
- `ContactMessage_id` (path): Record ID

```javascript
const record = await base44.entities.ContactMessage.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/ContactMessage/{ContactMessage_id}`
Delete a ContactMessage record

**Parameters:**
- `ContactMessage_id` (path): Record ID

```javascript
await base44.entities.ContactMessage.delete(recordId);
```

### `PUT /entities/ContactMessage/{ContactMessage_id}/restore`
Restore a deleted ContactMessage record

**Parameters:**
- `ContactMessage_id` (path): Record ID

```javascript
const record = await base44.entities.ContactMessage.restore(recordId);
```

## User

### Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes | The email of the user |
| `full_name` | string | Yes | The full name of the user |
| `role` | `admin`, `user` | Yes | The role of the user in the app |
| `id` | string |  | Unique record identifier |
| `created_date` | string |  | Record creation timestamp |
| `updated_date` | string |  | Record last update timestamp |
| `created_by_id` | string |  | ID of the user who created the record |

### Endpoints

### `GET /entities/User`
List User records

**Parameters:**
- `q` (query): JSON query filter, e.g. {"status":"active"}
- `limit` (query): Maximum number of records to return
- `skip` (query): Number of records to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order, e.g. -created_date

```javascript
const records = await base44.entities.User.list();
```

### `POST /entities/User`
Create a User record

```javascript
const record = await base44.entities.User.create({
  // your data
});
```

### `GET /entities/User/{User_id}`
Get a User record by ID

**Parameters:**
- `User_id` (path): Record ID

```javascript
const record = await base44.entities.User.get(recordId);
```

### `PUT /entities/User/{User_id}`
Update a User record

**Parameters:**
- `User_id` (path): Record ID

```javascript
const record = await base44.entities.User.update(recordId, {
  // fields to update
});
```

### `DELETE /entities/User/{User_id}`
Delete a User record

**Parameters:**
- `User_id` (path): Record ID

```javascript
await base44.entities.User.delete(recordId);
```

## Backend Functions

### `POST /functions/generateSitemap`
Invoke 'generateSitemap'

```javascript
const result = await base44.functions.generateSitemap({
  // your payload
});
```
## App Agent

### `GET /apps/6a9ea5d67a95141fb1f84b4a/agents/conversations`
List conversations

**Parameters:**
- `limit` (query): Maximum number of conversations to return
- `skip` (query): Number of conversations to skip (pagination)
- `sort_by` (query): Field name to sort by. Prefix with '-' for descending order

```javascript
const conversations = await base44.agents.getConversations();
```

### `POST /apps/6a9ea5d67a95141fb1f84b4a/agents/conversations`
Create a conversation

```javascript
const conversation = await base44.agents.createConversation({
  agent_name: "support_agent"
});
```

### `GET /apps/6a9ea5d67a95141fb1f84b4a/agents/conversations/{conversation_id}`
Get a conversation

**Parameters:**
- `conversation_id` (path): Conversation ID

```javascript
const conversation = await base44.agents.getConversation(conversationId);
```

### `POST /apps/6a9ea5d67a95141fb1f84b4a/agents/conversations/{conversation_id}/messages`
Send a message

**Parameters:**
- `conversation_id` (path): Conversation ID

```javascript
const response = await base44.agents.addMessage(
  conversation,
  { role: "user", content: "Hello, how can you help me?" }
);
```
