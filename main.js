var button = document.getElementsByClassName('submit')[0];
var i = 0

button.addEventListener('click', function() {
  var userName = $('#name').val();
  var post = $('#message').val();
  var source = $('#post-template').html();
  var templateFunc = Handlebars.compile(source);
  var newHtml = templateFunc({'userName':userName,'post':post, 'i':i})

  $('.posts').append(newHtml);

  // set the inital quality attribute to zero - it can be changed by clicking thumbs up and thumbs down
  $('#' + i).attr('qual', 0);
  //reset the form
  $('#message').val('')
  $('#name').val('')

  //hide the comments and submission form to start out and then toggle them on when "comments" is pressed
  $('.comment-button').parent().nextAll().hide()
  $('.comment-button').on('click', function(event1) {
    event1.stopImmediatePropagation()
    var isVisible = $(this).parent().nextAll().is(':visible');
    $(this).parent().nextAll().toggle(!isVisible)
  })

  $('.submit-comment').on('click', function(event1) {
    event1.stopImmediatePropagation();
    var commentName = $(this).prev().val();
    var commentContent = $(this).prev().prev().val()
    var source = $('#comment-template').html();
    var templateFunc = Handlebars.compile(source);
    var newHtml = templateFunc({'commentName':commentName,'commentContent':commentContent})

    $(this).parent().prev().append(newHtml)
    $(this).prev().val("");
    $(this).prev().prev().val("")

    $('.delete-comment').on('click', function(event1) {
      event1.stopImmediatePropagation();
      $(this).parent().remove()
    })

    $('.edit-comment').on('click', function(event1) {
      event1.stopImmediatePropagation();
      result = window.prompt("Update your comment", $(this).prev().prev().prev().html());
      if (result === null) {
        return;
      }
      $(this).prev().prev().prev().html(result)
    })

  })
  clickTools(i, post);
  i++
});



clickTools = function(rowId, post) {
  // provides upvote, downvote, edit, and delete buttons and reorders comments if needed based on up/down vote
  var qualityUpButton = document.getElementById('upBtn' + rowId);
  var qualityDownButton = document.getElementById('dwnBtn' + rowId);
  var trashButton = document.getElementById('trash' + rowId);
  var editButton = document.getElementById('edit' + rowId);
  var row = document.getElementById(rowId)
  var qualityUpButtons = document.getElementsByClassName('quality-up');
  var buttonsCount = qualityUpButtons.length;
  qualityUpButton.addEventListener('click', function() {
    trQual = parseInt(row.getAttribute('qual')) + 1
    row.setAttribute('qual', trQual)
    $('#qualCell' + rowId + ':nth-child(3)').contents().last().replaceWith("<span class='q-content'><p>" + trQual + "</p></span>");
    reorderPosts()
  });
  qualityDownButton.addEventListener('click', function() {
    trQual = parseInt(row.getAttribute('qual')) - 1
    if (trQual >= 0) {
      row.setAttribute('qual', trQual)
    } else {
      trQual = 0
      row.setAttribute('qual', 0)
    }
    $('#qualCell' + rowId + ':nth-child(3)').contents().last().replaceWith("<span class='q-content'><p>" + trQual + "</p></span>");
    reorderPosts()
  });
  trashButton.addEventListener('click', function() {
    row.remove()
  });
  editButton.addEventListener('click', function() {
    result = window.prompt("Update your post", post);
    if (result === null) {
      return;
    }
    $(this).parent().siblings('.Rtable-cell-wide').children('.cell-content').html(result)
    post = result
    // row.children[1].innerHTML = result
  })

  reorderPosts = function() {
    var qualObj = {}
    var items = []
    for (var j = 0; j < buttonsCount; j++) {
      qualObj["id"] = j
      qualObj["quality"] = document.getElementsByClassName("message")[j].getAttribute('qual')
      items[j] = Object.assign({}, qualObj)
    }
    items.sort(function(a, b) {
      return parseInt(b.quality) - parseInt(a.quality);
    });
    for (var k = 0; k < buttonsCount; k++) {
      document.getElementById(items[k].id).style.order = (k)
    }
  }
  reorderPosts()

}
