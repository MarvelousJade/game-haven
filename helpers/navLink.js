const Handlebars = require('handlebars');

module.exports = function(url, options) {
  const activeRoute = this.activeRoute || ''; // Access activeRoute from context
  const isActive = url === activeRoute;

  // Determine the class based on active route
  const className = isActive ? 'nav-link active' : 'nav-link';

  // Escape the URL to prevent XSS
  const href = Handlebars.escapeExpression(url);

  // Get the content inside the helper block
  const content = options.fn(this);

  // Construct the HTML string
  const html = `<li class="nav-item"><a class="${className}" href="${href}">${content}</a></li>`;

  // Return a SafeString to prevent Handlebars from escaping the HTML
  return new Handlebars.SafeString(html);
};

