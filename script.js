;(function () {
	const $ = (sel, root = document) => root.querySelector(sel)
	const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

	const packs = $$('.pack')

	function select(pack) {
		packs.forEach(p => {
			const on = p === pack
			p.classList.toggle('is-active', on)
			const radio = $('[role="radio"]', p)
			radio.setAttribute('aria-checked', on)
			radio.tabIndex = on ? 0 : -1
		})
	}

	packs.forEach((pack, i) => {
		const radio = $('[role="radio"]', pack)
		radio.tabIndex = pack.classList.contains('is-active') ? 0 : -1

		radio.onclick = () => select(pack)
		radio.onkeydown = e => {
			const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[
				e.key
			]
			if (!step) return
			e.preventDefault()
			const next = packs[(i + step + packs.length) % packs.length]
			select(next)
			$('[role="radio"]', next).focus()
		}
	})

	$$('.pack__cart').forEach(btn => {
		btn.onclick = () => {
			select(btn.closest('.pack'))
			btn.classList.add('is-done')
			setTimeout(() => btn.classList.remove('is-done'), 700)
		}
	})

	const favorite = $('.favorite')
	favorite.onclick = () => {
		const on = favorite.getAttribute('aria-pressed') === 'true'
		favorite.setAttribute('aria-pressed', !on)
	}

	const tabs = $$('.tabs__btn')

	function activateTab(btn) {
		tabs.forEach(b => {
			const on = b === btn
			b.classList.toggle('is-active', on)
			b.setAttribute('aria-selected', on)
			b.tabIndex = on ? 0 : -1
			const panel = document.getElementById(b.getAttribute('aria-controls'))
			if (panel) panel.hidden = !on
		})
	}

	tabs.forEach((btn, i) => {
		btn.onclick = () => activateTab(btn)
		btn.onkeydown = e => {
			const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
			if (!step) return
			e.preventDefault()
			const next = tabs[(i + step + tabs.length) % tabs.length]
			activateTab(next)
			next.focus()
		}
	})

	const list = $('.related__list')
	if (!list) return

	const scrollNext = () => {
		const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1
		list.scrollBy({
			left: atEnd ? -list.scrollLeft : list.clientWidth,
			behavior: 'smooth'
		})
	}

	let timer = setInterval(scrollNext, 5000)
	list.onmouseenter = () => clearInterval(timer)
	list.onmouseleave = () => (timer = setInterval(scrollNext, 5000))

	$$('.related__arrow').forEach((btn, i) => {
		btn.onclick = () =>
			list.scrollBy({
				left: (i === 0 ? -1 : 1) * list.clientWidth,
				behavior: 'smooth'
			})
	})
})()
