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
		}
	},
	computed: {
		playerHealthBar() {
			return { width: this.playerHealth + '%' }
		},
		monsterHealthBar() {
			return { width: this.monsterHealth + '%' }
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
		},
		attackPlayer() {
			const healthValue = this.getRandomValue(8, 13)
			this.playerHealth -= healthValue
		},
		specialAttackMonster() {
			this.currentRound++
			const healthValue = this.getRandomValue(10, 25)
			this.monsterHealth -= healthValue
			this.attackPlayer()
			this.cooldown.specialAttack += 3
			this.cooldown.heal = Math.max(0, --this.cooldown.heal)
		},
		healPlayer() {
			this.currentRound++
			const healthValue = this.getRandomValue(10, 20)
			// this.playerHealth = Math.min(this.playerHealth + this.healthValue, 100);
			this.playerHealth = this.playerHealth + healthValue > 100 ? 100 : this.playerHealth + healthValue
			this.attackPlayer()
			this.cooldown.heal += 3
			this.cooldown.specialAttack = Math.max(0, --this.cooldown.specialAttack)
		},
	},
})

app.mount('#game')
