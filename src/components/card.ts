import type { Card } from '../types/Card';

export default () => ({
	isSelected: false,

	selectCard() {
		this.isSelected = true;

		const cardId = this.$el.dataset.cardId;

		
	}
});
