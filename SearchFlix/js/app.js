document.addEventListener('DOMContentLoaded', function () {
  particleground(document.getElementById('particles'), {
    dotColor: '#E83951',
    lineColor: '#a8dadc'
  });
  var intro = document.getElementById('intro');
  intro.style.marginTop = - intro.offsetHeight / 2 + 'px';
}, false);

$(document).ready(function(){
	$('.skillbar').each(function(){
		$(this).find('.skillbar-bar').animate({
			width:$(this).attr('data-percent')
		},1500);
	});
});


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

function csvJSON(csv) {
  var lines = csv.split('\n');
  var result = [];
  var headers = ['n', 't'];
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j].replace(/"(.+)"/g, '$1');
    }
    result.push(obj);
  }
  return result;
}

$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: 'https://raw.githubusercontent.com/peterzam/SearchFlix/master/extension/src/data/result.csv',
    dataType: 'text',
    success: function (csv) {
      var data = csvJSON(csv);
      $('#searchCategory').keyup(
        debounce(function () {
          var searchField = $('#searchCategory').val();
          var resultCount = 0;
          var searchExpression = new RegExp(searchField, 'i');
          var resultOutput = '';
          console.log(typeof searchExpression + searchExpression);
          $.each(data, function (_, val) {
            if (
              searchExpression != '/(?:)/i' &&
              val.t.search(searchExpression) != -1
            ) {
              resultOutput += '<div class="result"  class="tab-pane fade">';
              resultOutput +=
                '<a href="https://www.netflix.com/browse/genre/' +
                val.n +
                '" target=_blank>';
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
        }, 200)
      );
      $('body').on('click', '.result a', addEventListenersToResults);
    },
  });
});
