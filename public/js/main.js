const ScoreStyles = {
    Normal: {
        name: 'normal',
        score: (input) => {
            return Number(input.value);
        }
    },
    Wizard: {
        name: 'wizard',
        score: (form) => {
            const bet = Number(form[0].value);
            const act = Number(form[1].value);
            if (bet === act) return 20 + 10 * bet;
            return -10 * Math.abs(bet - act);
        }
    },
    SYN: {
        name: 'screw your neighbour',
        score: (input) => {
            if (input.disabled) return 0;
            return 10 + Number(input.value);
        }
    }
}

class Player {
    constructor(name) {
        this.name = name ?? '';
        this.col = null;
        this.id = players.length;
    }
}

const players = [];
let scoreStyle = ScoreStyles.SYN;
let rounds = 1;

function createColumn(player) {
    const column = document.createElement('div');
    column.classList.add('column')

    const header = document.createElement('div');
    header.classList.add('column-header', 'cell');

    const nameInput = document.createElement('input');
    nameInput.classList.add('form-control', 'name-input');
    nameInput.addEventListener('change', e => {
        player.name = nameInput.value;
    });
    nameInput.value = player.name;

    header.appendChild(nameInput);
    column.appendChild(header);

    for (let i = 1; i <= rounds; i++) {
        column.appendChild(createCell(player, i, scoreStyle));
    }

    return column;
}
    
function createCell(player, round, scoreStyle) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (!player) {
        cell.innerText = round;
        return cell;
    }
    switch(scoreStyle) {
        case ScoreStyles.Normal:
            input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control')
            input.id = `p${player.id}-${round}`;
            cell.appendChild(input);
            break;
        case ScoreStyles.SYN:
            input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control', 'score-input')
            input.id = `p${player.id}-${round}`;
            input.value = 0;
            cell.appendChild(input);

            btn = document.createElement('button');
            btn.innerText = "X"
            btn.classList.add('btn', 'btn-primary', 'btn-fail');
            btn.addEventListener('click', e => {
                const disabled = $(`#p${player.id}-${round}`).prop('disabled');
                $(`#p${player.id}-${round}`).prop('disabled', !disabled);
            });
            cell.appendChild(btn);
            break;
        case ScoreStyles.Wizard:
            form = document.createElement('form');
            form.id = `p${player.id}-${round}`;
            form.classList.add('wizard-form');

            betContainer = document.createElement('div');
            betContainer.classList.add('d-flex', 'flex-row')

            betLabel = document.createElement('label');
            betLabel.innerText = 'Bet: ';
            betLabel.for = 'bet';

            bet = document.createElement('input');
            bet.type = 'number';
            bet.classList.add('form-control', 'wizard-input')
            bet.name = 'bet';
            bet.value = 0;

            betContainer.appendChild(betLabel);
            betContainer.appendChild(bet);
            

            actContainer = document.createElement('div');
            actContainer.classList.add('d-flex', 'flex-row')

            actLabel = document.createElement('label');
            actLabel.innerText = 'Taken: ';
            actLabel.for = 'act';

            act = document.createElement('input');
            act.type = 'number';
            act.classList.add('form-control', 'wizard-input')
            act.name = 'act';
            act.value = 0;

            actContainer.appendChild(actLabel);
            actContainer.appendChild(act);

            form.appendChild(betContainer);
            form.appendChild(actContainer);
            cell.appendChild(form);
            break;
    }
    return cell;
}

function addCell(column, player, round, scoreStyle) {
    const cell = createCell(player, round, scoreStyle);
    column.appendChild(cell);
    if (!scoreStyle) {
        cell.innerText = round;
        return;
    }

}

function score() {
    for (let i = 0; i < players.length; i++) {
        let score = 0;
        for (let j = 1; j <= rounds; j++) {
            score += scoreStyle.score(document.getElementById(`p${i}-${j}`))
        }
        alert(`${players[i].name}: ${score}`);
    }
}

function addPlayer() {
    const btn = document.getElementById('add-player');
    const board = document.getElementById('table');
    const player = new Player("Player " + (players.length + 1));
    players.push(player);
    const col = createColumn(player);
    player.col = col;
    board.appendChild(col);
}

$(document).ready(() => {
    const col = document.getElementById('rounds');

    // Handle Round Count Change
    $('#round-count').on('change', e => {
        const temp = rounds;
        rounds = Math.max(1, Math.min(Math.floor($('#round-count').val()), 100));
        $('#round-count').val(rounds);
        if (rounds > temp) {
            for (let i = temp + 1; i <= rounds; i++) {
                addCell(col, null, i);
            }
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                for (let j = temp + 1; j <= rounds; j++) {
                    addCell(player.col, player, j, scoreStyle);
                }
            }
        } else if (rounds < temp) {
            for (let i = rounds; i < temp; i++) {
                col.lastElementChild.remove();
            }
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                for (let j = rounds; j < temp; j++) {
                    player.col.lastElementChild.remove();
                }
            }
        }
    });
    
    // Handle Add Player
    $('#add-player').on('click', e => addPlayer());

    $('#score').on('click', e => {
        score();
    });

    $('.style-btn').on('click', e => {
        switch(e.target.dataset.scorestyle) {
            case 'normal':
                scoreStyle = ScoreStyles.Normal;
                break;
            case 'wizard':
                scoreStyle = ScoreStyles.Wizard;
                break;
            case 'syn':
                scoreStyle = ScoreStyles.SYN;
                break;
        }
        $('#cover').fadeOut('fast', () => {
            addCell(col, null, 1);
            addPlayer();
        });
    });
});