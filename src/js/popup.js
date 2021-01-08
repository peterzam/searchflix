function addEventListenersToResults(e) {
  var href = e.currentTarget.href;
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.create({ url: href });
  });
}

$(document).ready(function () {
  $('#searchCategory').keyup(function () {
    var searchField = $('#searchCategory').val();
    console.log(searchField);
    var searchExpression = new RegExp(searchField, 'i');
    $.getJSON('data/categories.json', function (data) {
      var resultOutput = '';
      $.each(data, function (key, val) {
        if (val.title.search(searchExpression) != -1) {
          resultOutput += '<div class="result">';
          resultOutput += '<a href="' + val.href + '">';
          resultOutput += val.title;
          resultOutput += '</a></div>';
        }
      });
      $('#resultsList').html(resultOutput);
    });
  });
  $('body').on('click', '.result a', addEventListenersToResults);
});
