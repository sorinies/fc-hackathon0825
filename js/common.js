(function() {
  let battle; 
  let battleList = $(".battlelist")[0];
  let html = ``;
  let lastIndex; 

  function drawContents(list) {
    list.map(x => {
      lastIndex = x.id;
      html += `
        <div class="card text-center" id="${x.id}">
          <div class="card-body">
            <h4 class="card-title">${x.title}</h4>
            <div class="item-title-wrap clearfix">
              <h6 class="card-subtitle mb-2 text-muted float-left item-title">${x.name_0}</h6>
              <h6 class="card-subtitle mb-2 text-muted float-right item-title">${x.name_1}</h6>
            </div>
            <div class="progress" id="progress-${x.id}">
              <div id="pBar-${x.id}-0" class="progress-bar progress-bar-striped progress-bar-animated vote-bar" role="progressbar" style="width: ${x.per_0}%">${x.vote_0}</div>
              <div id="pBar-${x.id}-1" class="progress-bar bg-success progress-bar-striped progress-bar-animated vote-bar" role="progressbar" style="width: ${x.per_1}%">${x.vote_1}</div>
            </div>
          </div>
          <div class="card-footer text-muted">
            ${x.date}
          </div>
        </div>
      `;
    }); 
    battleList.innerHTML = html;
  }

  function getList() {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open('GET', 'http://localhost:7000/battle', true);
      req.send();

      req.onreadystatechange = function(e) {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            resolve(req.responseText);
          } else {
            reject(req.statusText);
          }
        } 
      }
    });
  }

  function postList(item) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open('POST', 'http://localhost:7000/battle', true);
      req.setRequestHeader('Content-type', 'application/json');
      req.send(JSON.stringify(item));

      req.onreadystatechange = function(e) {
        if (req.status === 201) {
          resolve(item);
        } else {
          reject(req.statusText);
        }
      }
    });
  }

  function patchItem(id, vote_left, vote_right, per_left, per_right) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open('PATCH', `http://localhost:7000/battle/${id}`, true);
      req.setRequestHeader('Content-type', 'application/json');
      req.send(JSON.stringify({
        vote_0: vote_left,
        per_0: per_left,
        vote_1: vote_right,
        per_1: per_right
      }));

      req.onreadystatechange = function(e) {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
          resolve('Working...');
        } else {
          reject(req.statusText);
        }
      }
    });
  }

  getList()
    .then((res) => {
      battle = JSON.parse(res);
      drawContents(battle);
      return res;
    })
    .then((res) => {
      // pBar로 시작하는 id의 오브젝트(프로그레스바)가 선택됐을 때 아래 구문을 실행한다.
      $('[id^=pBar-]').click(function(e){
        /* 
          tempPer: 선택한 항목의 비율
          oppoPer: 반대편 항목의 비율
          tempOppo: 선택한 항목의 득표수
          oppoVote: 반대편 항목의 특표수
        */
        let tempPer, oppoVote;
        let tempVote = $(this).text(); // 현재 득표수를 취득

        // 선택한 항목의 반대편 득표수를 oppoVote에 대입
        if (e.target.id == ($(this).parent().children().eq(0)[0]).id) {
          oppoVote = $(this).parent().children().eq(1).text();
        } else if (e.target.id == ($(this).parent().children().eq(1)[0]).id) {
          oppoVote = $(this).parent().children().eq(0).text();
        }
        tempVote = tempVote * 1 + 1; // 선택항 항목의 득표수를 +1
        oppoVote = oppoVote * 1;

        // 득표수로 비율을 구해 각 변수에 대입
        tempPer = tempVote / (oppoVote + tempVote) * 100; 
        oppoPer = oppoVote / (oppoVote + tempVote) * 100;
        
        e.target.style.width = tempPer + '%'; // 선택한 항목의 width를 계산된 비율로 변경.

        // 선택한 항목의 반대편 width를 계산된 비율로 변경.    
        if (e.target.id == ($(this).parent().children().eq(0)[0]).id) {
          $(this).parent().children().eq(1).css('width', oppoPer + '%');
          patchItem($(this)[0].id[5], tempVote, oppoVote, tempPer, oppoPer)
          .then((res) => console.log(res)).catch((e) => console.log(e));
        } else if (e.target.id == ($(this).parent().children().eq(1)[0]).id) {
          $(this).parent().children().eq(0).css('width', oppoPer + '%');
          patchItem($(this)[0].id[5], oppoVote, tempVote, oppoPer, tempPer)
          .then((res) => console.log(res)).catch((e) => console.log(e));
        }

        // 선택한 항목의 득표수를 올려 표시.
        e.target.innerText = tempVote;

      });
    })

  document.querySelector('.btn-primary').addEventListener('click', (e) => {
    const title = document.getElementById('battleTitleInput').value;
    const name_0 = document.getElementById('battleItemInput1').value;
    const name_1 = document.getElementById('battleItemInput2').value;
    const date = new Date();

    if (title) {
      const newItem = {
        id: lastIndex + 1,
        title,
        date: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`,
        name_0,
        vote_0: 0,
        per_0: 50,
        name_1,
        vote_1: 0,
        per_1: 50
      };

      postList(newItem)
      .then((res) => {
        drawContents([res]);
      }).catch((e) => console.log(e));
    }
  });
}())