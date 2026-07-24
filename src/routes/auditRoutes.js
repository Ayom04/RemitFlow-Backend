'use strict';

const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireScope = require('../middleware/requireScope');
const auditController = require('../controllers/auditController');

const router = express.Router();

// GET /api/audit
// Lists audit log entries (newest first). Supports ?resourceId= and ?limit=/?offset=.
router.get('/', requireScope(['audit:read']), asyncHandler(auditController.listAuditEntries));

module.exports = router;
