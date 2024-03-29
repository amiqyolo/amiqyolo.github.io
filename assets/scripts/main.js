document.addEventListener('DOMContentLoaded', function() {
  var body = document.querySelector('body'),
      header = document.querySelector('header'),
      footer = document.querySelector('footer'),
      main = document.querySelector('main'),
      mainArticles = main.children;

  // Main
  var delay = 325,
      locked = false;

  // Show Article Methods
  main._show = function(id) {
    var article = document.getElementById(id);

    // No such article? Bail
    if (!article) return;

    // Handle lock
    if (locked) {
      // Mark as visible
      body.classList.add('show-article');

      // Deactivate all articles (just in case one's already active)
      Array.from(mainArticles).forEach(function(article) {
        article.classList.remove('active');
      });

      // Hide header, footer
      header.style.display = 'none';

      // Show main, article
      main.style.display = 'flex';
      article.style.display = 'flex';

      // Activate article
      article.classList.add('active');

      // Unlock
      locked = false;

      return;
    }

    // Lock
    locked = true;

    // Article already visible? Just swap articles.
    if (body.classList.contains('show-article')) {
      // Deactivate current article.
      var currentArticle = main.querySelector('.active');
      currentArticle.classList.remove('active');

      // Show article.
      setTimeout(function() {
        // Hide current article.
        currentArticle.style.display = 'none';

        // Show article.
        article.style.display = 'flex';

        // Activate article.
        setTimeout(function() {
          article.classList.add('active');

          // Window stuff.
          window.scrollTo(0, 0);
          window.dispatchEvent(new Event('resize'));

          // Unlock.
          setTimeout(function() {
              locked = false;
          }, delay);

        }, 25);

      }, delay);
    } else { // Otherwise, handle as normal.
      // Mark as visible.
      body.classList.add('show-article');

      // Show article.
      setTimeout(function() {
        // Hide header, footer.
        header.style.display = 'none';

        // Show main, article.
        main.style.display = 'flex';
        article.style.display = 'flex';

        // Activate article.
        setTimeout(function() {
          article.classList.add('active');

          // Windows stuff
          window.scrollTo(0, 0);
          window.dispatchEvent(new Event('resize'));

          // Unlock
          setTimeout(function() {
              locked = false;
          }, delay);

        }, 25);

      }, delay);
    }
  };

  // Hide Articles Method
  main._hide = function(addState) {
    var article = main.querySelector('.active');

    // Article not visible? Bail.
    if (!body.classList.contains('show-article')) return;

    // Add state?
    if (typeof addState !== 'undefined' && addState === true) history.pushState(null, null, '#');

    // Handle lock.
    if (locked) {
      // Deactivate article.
      article.classList.remove('active');

      // Hide article, main.
      article.style.display = 'none';
      main.style.display = 'none';

      // Show footer, header.
      header.style.display = 'flex';

      // Unmark as visible.
      body.classList.remove('show-article');

      // Unlock.
      locked = false;

      // Window stuff.
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('resize'));

      return;
    }

    // Lock.
    locked = true;

    // Deactivate article.
    article.classList.remove('active');

    // Hide article.
    setTimeout(function() {
      // Hide article, main.
      article.style.display = 'none';
      main.style.display = 'none';

      // Show footer, header.
      header.style.display = 'flex';

      // Unmark as visible.
      setTimeout(function() {
        body.classList.remove('show-article');

        // Window stuff.
        window.scrollTo(0, 0);
        window.dispatchEvent(new Event('resize'));

        // Unlock.
        setTimeout(function() {
            locked = false;
        }, delay);

      }, 25);

    }, delay);
  };

  // Articles.
  Array.from(mainArticles).forEach(function(article) {
    // Close
    var closeDiv = document.createElement('div');
    closeDiv.className = 'close';
    closeDiv.textContent = 'Close';
    article.appendChild(closeDiv);

    closeDiv.addEventListener('click', function() {
      location.hash = '';
    });

    // Prevent clicks from inside article from bubbling.
    article.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  });

  // Events.
  body.addEventListener('click', function() {
    // Article visible? Hide.
    if (body.classList.contains('show-article')) main._hide(true);
  });

  window.addEventListener('hashchange', function(event) {
    // Empty hash?
    if (location.hash === '' || location.hash === '#') {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
      main._hide();
    } else { // Otherwise, check for a matching article.
      var article = main.querySelector(location.hash);
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Show article.
      if (article) main._show(location.hash.substr(1));
    }
  });

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  } else {
    var oldScrollPos = 0,
        scrollPos = 0,
        htmlBody = document.querySelector('html,body');

    window.addEventListener('scroll', function() {
      oldScrollPos = scrollPos;
      scrollPos = htmlBody.scrollTop;
    });

    window.addEventListener('hashchange', function() {
      window.scrollTo(oldScrollPos);
    });
  }

  // Initialize.
  // Hide main, articles.
  main.style.display = 'none';
  Array.from(mainArticles).forEach(function(article) {
    article.style.display = 'none';
  });

  // Initial article.
  if (location.hash !== '' && location.hash !== '#') {
    window.addEventListener('load', function() {
      main._show(location.hash.substr(1));
    });
  }

  // Get all <pre> elements
  var preElements = document.querySelectorAll('pre');

  // Loop through each <pre> element
  preElements.forEach(function(preElement) {
      // Get the HTML content of the <pre> element
      var html = preElement.innerHTML;

      // Replace each line with the specified HTML
      html = html.replace(/^(.*)$/mg, "<span class=\"line\">$1</span>");

      // Set the modified HTML back to the <pre> element
      preElement.innerHTML = html;
  });

});