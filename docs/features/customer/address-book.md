# Address Book (Customer Portal)

Customers manage shipping and billing locations from their profile page to speed up online checkout checkout flows.

---

## Data Model

A `CustomerAddress` record contains:
* `id` (guid): Unique identifier.
* `customerId` (guid): Mapped customer reference.
* `label` (string): Personal identifier (e.g. `Home`, `Work`).
* `recipientName` (string): Receiver name.
* `recipientPhone` (string): Contact number.
* `postalCode` (string): Postal code mapping.
* `prefecture` (string): Prefecture/State.
* `city` (string): City.
* `streetAddress` (string): Detailed street name and numbers.
* `buildingName` (string): Optional apartment details.
* `isDefault` (boolean): Default checkout address flag.

---

## Workflows

1. **Address Integration**: During checkout, default address details auto-fill the forms.
2. **Postal Code Resolution**: Inputting a postcode triggers `PostcodeService` to query database definitions and resolve Prefecture/City fields.
