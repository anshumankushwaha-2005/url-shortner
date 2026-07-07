/**
 * Sends a success response. `data` is spread directly onto the response body
 * so routes can do sendSuccess(res, { user, token }) -> { success: true, user, token }.
 */
function sendSuccess(res, data = {}, statusCode = 200) {
  return res.status(statusCode).json({ success: true, ...data });
}

/**
 * Sends an error response with a message and optional field-level errors.
 */
function sendError(res, message = "Something went wrong", statusCode = 500, errors = undefined) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
