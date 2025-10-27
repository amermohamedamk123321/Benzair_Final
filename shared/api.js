/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response for /api/demo
 * @typedef {Object} DemoResponse
 * @property {string} message
 */

/**
 * @typedef {Object} ImportRecord
 * @property {number} quantity
 * @property {string} date ISO string
 *
 * @typedef {Object} ExportRecord
 * @property {number} quantity
 * @property {string} date ISO string
 * @property {string} destination
 *
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} unit
 * @property {number} price
 * @property {string} imageUrl
 * @property {string} createdAt
 * @property {ImportRecord[]} imports
 * @property {ExportRecord[]} exports
 * @property {number} [baseStock]
 * @property {('imported'|'bought')} [source]
 * @property {('USD'|'AFN')} [currency]
 * @property {number} [available]
 *
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} productId
 * @property {string} productName
 * @property {number} quantity
 * @property {string} customerName
 * @property {string} [customerEmail]
 * @property {string} [destination]
 * @property {string} [notes]
 * @property {string} status
 * @property {string} createdAt
 */
