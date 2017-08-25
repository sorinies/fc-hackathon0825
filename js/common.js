let battle = [
    { "id": 0,
      "title": "대결 제목",
      "date": "2017-05-25",
      "item": [
        { "cid": 0,
          "name": "아이템 이름",
          "vote": 5,
          "per": "35.7142857143"
        },
        { "cid": 1,
          "name": "아이템 이름",
          "vote": 9,
          "per": 64.2857142857
        },
      ],
    },
    { "id": 1,
      "title": "대결 제목 2",
      "date": "2017-05-25",
      "item": [
        { "cid": 0,
          "name": "아이템 이름 2",
          "vote": 9,
          "per": "69.2307692308"
        },
        { "cid": 1,
          "name": "아이템 이름 2",
          "vote": 4,
          "per": 30.7692307692
        },
      ],
    },
  ];

//(function() {
  let battleList = $(".battlelist")[0];
  let html = ``;

  function drawContents() {
    html = ``;
    battleList.innerHTML = html;
    battle.map((x, i) => {
      //let percent = [battle[i].item[0].vote/(battle[i].item[0].vote + battle[i].item[1].vote) * 100, battle[i].item[1].vote/(battle[i].item[0].vote + battle[i].item[1].vote) * 100]
      html += `
        <div class="card text-center" id="${battle[i].id}">
          <div class="card-body">
            <h4 class="card-title">${battle[i].title}</h4>
            <div class="item-title-wrap clearfix">
              <h6 class="card-subtitle mb-2 text-muted float-left item-title">${battle[i].item[0].name}</h6>
              <h6 class="card-subtitle mb-2 text-muted float-right item-title">${battle[i].item[1].name}</h6>
            </div>
            <div class="progress" id="progress-${battle[i].id}">
              <div id="pBar-${battle[i].id}-0" class="progress-bar progress-bar-striped progress-bar-animated vote-bar" role="progressbar" style="width: ${battle[i].item[0].per}%">${battle[i].item[0].vote}</div>
              <div id="pBar-${battle[i].id}-1" class="progress-bar bg-success progress-bar-striped progress-bar-animated vote-bar" role="progressbar" style="width: ${battle[i].item[1].per}%">${battle[i].item[1].vote}</div>
            </div>
          </div>
          <div class="card-footer text-muted">
            ${battle[i].date}
          </div>
        </div>
      `;
    }); 
    battleList.innerHTML = html;
  }
  drawContents();
  $('[id^=pBar-]').click(function(e){
    let tempPer, oppoVote;
    let tempVote = $(this).text();

    if (e.target.id == ($(this).parent().children().eq(0)[0]).id) {
      oppoVote = $(this).parent().children().eq(1).text();
    } else if (e.target.id == ($(this).parent().children().eq(1)[0]).id) {
      oppoVote = $(this).parent().children().eq(0).text();
    }
    tempVote = tempVote * 1 + 1;
    oppoVote = oppoVote * 1;

    tempPer = (tempVote / (oppoVote + tempVote) * 100) + '%';
    oppoPer = (oppoVote / (oppoVote + tempVote) * 100) + '%';
    
    e.target.style.width = tempPer;

    if (e.target.id == ($(this).parent().children().eq(0)[0]).id) {
      //$(this).parent().children().eq(1)[0].css('width', function(){
      //$(this).parent().children().eq(1)[0].style.width = oppoPer;
      $(this).parent().children().eq(1).css('width', oppoPer);
    } else if (e.target.id == ($(this).parent().children().eq(1)[0]).id) {
      $(this).parent().children().eq(0).css('width', oppoPer);
    }

    e.target.innerText = tempVote;

    //$(this).css('width', "10%");
  })
//}())