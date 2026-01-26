<footer>
	<p class="s">Trajectories of Engagement</p>
</footer>

<style>
	footer {
		background-color: var(--primary-color);
		border-top: 2px solid var(--primary-dark);
		border-left: 1px solid #777;
		border-right: 1px solid #777;
		padding: var(--space-m) var(--space-xl);
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: var(--page-max-width);
		z-index: 100;
	}

	@media (max-width: 768px) {
		footer {
			display: none;
		}
	}
</style>
