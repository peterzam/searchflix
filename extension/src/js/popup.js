function addEventListenersToResults(e) {
  var href = e.currentTarget.href;
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.create({ url: href });
  });
}

function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

$(document).ready(function () {
  $('#searchCategory').keyup(
    debounce(function () {
      var searchField = $('#searchCategory').val();
      var resultCount = 0;
      var searchExpression = new RegExp(searchField, 'i');
      $.getJSON('data/categories.json', function (data) {
        var resultOutput = '';
        console.log(typeof searchExpression + searchExpression);
        $.each(data, function (_, val) {
          if (
            searchExpression != '/(?:)/i' &&
            val.t.search(searchExpression) != -1
          ) {
            resultOutput += '<div class="result"  class="tab-pane fade">';
            resultOutput +=
              '<a href="https://www.netflix.com/browse/genre/' + val.n + '">';
            resultOutput += val.t;
            resultOutput += '</a></div>';
            console.log(searchField.length);
            resultCount += 1;
          }
          if (resultCount > 500) {
            return false;
          }
        });
        $('#resultsList').html(resultOutput);
      });
    }, 100)
  );
  $('body').on('click', '.result a', addEventListenersToResults);
});