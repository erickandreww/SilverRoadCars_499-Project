function getPaginationData(req, totalItems, limit = 10) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;

  return { page, limit, offset, totalItems, totalPages,
    hasPrevious: page > 1, hasNext: page < totalPages, 
    previousPage: page - 1, nextPage: page + 1
  };
}

function getPageOffset(req, limit = 10) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const offset = (page - 1) * limit;

  return { 
    page, limit, offset 
  };
}

module.exports = { getPaginationData, getPageOffset };