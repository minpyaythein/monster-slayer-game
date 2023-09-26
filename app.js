const app = Vue.createApp({
	data() {
		return {
			playerHealth: 100,
			monsterHealth: 100,
			currentRound: 0,
			cooldown: {
				specialAttack: 0,
				heal: 0,
			},
			winner: null,
			logMessages: [],
		}
	},
	computed: {
		playerHealthBar() {
			// if (this.playerHealth < 0) {
			// 	return { width: '0%' }
			// }
			// return { width: this.playerHealth + '%' }
			return this.playerHealth < 0 ? { width: '0%' } : { width: this.playerHealth + '%' }
		},
		monsterHealthBar() {
			// if (this.monsterHealth < 0) {
			// 	return { width: '0%' }
			// }
			// return { width: this.monsterHealth + '%' }
			return this.monsterHealth < 0 ? { width: '0%' } : { width: this.monsterHealth + '%' }
		},
	},
	watch: {
		playerHealth(value) {
			if (value <= 0 && this.monsterHealth <= 0) {
				this.winner = 'draw'
			} else if (value <= 0) {
				this.winner = 'monster'
			}
		},
		monsterHealth(value) {
			if (value <= 0 && this.playerHealth <= 0) {
				this.winner = 'draw'
			} else if (value <= 0) {
				this.winner = 'player'
			}
		},
	},
	methods: {
		getRandomValue(max, min) {
			return Math.floor(Math.random() * (max - min)) + min
		},
		startGame() {
			this.playerHealth = 100
			this.monsterHealth = 100
			this.currentRound = 0
			Object.keys(this.cooldown).forEach((type) => {
				this.cooldown[type] = 0
			})
			this.winner = null
		},
		attackMonster() {
			this.currentRound++
			const healthValue = this.getRandomValue(5, 12)
			this.monsterHealth -= healthValue
			this.attackPlayer()
			// if (this.cooldown > 0) {
			// 	this.cooldown--
			// }
			// this.cooldown = this.cooldown > 0 ? --this.cooldown : this.cooldown
			Object.keys(this.cooldown).forEach((type) => {
				this.cooldown[type] = Math.max(0, --this.cooldown[type])
			})
			this.addLogMessage('player', 'attack', healthValue)
		},
		attackPlayer() {
			const healthValue = this.getRandomValue(8, 13)
			this.playerHealth -= healthValue
			this.addLogMessage('monster', 'attack', healthValue)
		},
		specialAttackMonster() {
			this.currentRound++
			const healthValue = this.getRandomValue(10, 25)
			this.monsterHealth -= healthValue
			this.attackPlayer()
			this.cooldown.specialAttack += 3
			this.cooldown.heal = Math.max(0, --this.cooldown.heal)
			this.addLogMessage('player', 'special-attack', healthValue)
		},
		healPlayer() {
			this.currentRound++
			const healthValue = this.getRandomValue(10, 20)
			this.playerHealth = Math.min(this.playerHealth + healthValue, 100)
			// this.playerHealth = this.playerHealth + healthValue > 100 ? 100 : this.playerHealth + healthValue
			this.attackPlayer()
			this.cooldown.heal += 3
			this.cooldown.specialAttack = Math.max(0, --this.cooldown.specialAttack)
			this.addLogMessage('player', 'heal', healthValue)
		},
		surrender() {
			this.winner = 'monster'
		},
		addLogMessage(who, what, value) {
			this.logMessages.unshift({
				actionBy: who,
				actionType: what,
				actionValue: value,
			})
		},
	},
})

app.mount('#game')
