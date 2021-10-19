class Main {
  constructor(data) {
    this.data = data

    this.UI = {
      topMenu: null,
      bottomMenu: null,
      leftMenu: null,
      scroller: null
    }
    this.dom = null

    this.slider = null

    this.isDefault = false
    this.isScrolling = false
  }

  init() {
    this.dom = document.querySelector('#team-moscow-content')

    this.isDefault = this.dom.classList.contains('default')

    this.generateMainMenu()

    if (this.isDefault) {
      this.generateLeftMenu()
      window.addEventListener("scroll", this.throttleScroll.bind(this), false);
    }
    else {
      this.slider = new Slider(this.data.slider, this.dom.querySelector('.slider'))
    }
  }

  throttleScroll(e) {
    if (this.isScrolling == false) {
      window.requestAnimationFrame(() => {
        this.onScroll(e);
        this.isScrolling = false;
      });
    }
    this.isScrolling = true;
  }

  onScroll(e) {
    this.updateLeftMenu()
  }

  updateLeftMenu() {
    if (this.isDefault) {
      if (this.UI.leftMenu) {
        const windowPosition = {
          top: window.pageYOffset,
          bottom: window.pageYOffset + document.documentElement.clientHeight
        }

        this.UI.leftMenu.menuItems.forEach(menuItem => {
          let activeItems = this.UI.leftMenu.menuItems.filter(item => item.active)
          const targetPosition = window.pageYOffset + menuItem.targetElement.getBoundingClientRect().top

          if (targetPosition < windowPosition.bottom - document.documentElement.clientHeight / 2) {
            this.UI.leftMenu.toggleActive(true, menuItem)
          }
          else {
            this.UI.leftMenu.toggleActive(false, menuItem)
          }
        })
      }
    }
  }

  generateMainMenu() {
    const { menu } = this.data
    this.UI.topMenu = new Menu(menu, this.dom.querySelector('#top-nav-menu'), 'top')
    this.UI.bottomMenu = new Menu(menu, this.dom.querySelector('#bottom-nav-menu'), 'bottom')
  }

  generateLeftMenu() {
    const headings = Array.from(this.dom.querySelectorAll('.heading2'))
    const menu = headings.map((value, index) => {
      return {
        element: value,
        textContent: value.textContent,
        id: index
      }
    })

    this.UI.leftMenu = new AsideMenu(menu, this.dom.querySelector('#nav-left .left-menu'))
  }

}

class Menu {
  constructor(itemsData, element, position = null) {
    this.itemsData = itemsData
    this.element = element
    this.position = position
    this.menuItems = []

    this.createMenu()
  }

  createMenuItem(item, key) {
    const menuItem = document.createElement('li')
    const link = document.createElement('a')
    const dropdown = document.createElement('ul')

    menuItem.classList.add('nav-menu-item')
    dropdown.classList.add('nav-menu-dropdown')

    menuItem.id = this.position ? this.position + '-' + key : key

    link.href = item.href
    link.textContent = item.title
    menuItem.append(link)

    if (item.content) {
      let html = ''
      item.content.forEach(element => {
        html += `<li><a href="${element[1]}">${element[0]}</a></li>`
      });
      dropdown.innerHTML = html
      menuItem.append(dropdown)
    }

    return {
      item: menuItem,
      link: link,
      dropdown: dropdown
    }
  }

  createMenu() {
    let fragment = document.createDocumentFragment()

    for (const key in this.itemsData) {
      let newMenuItem = this.createMenuItem(this.itemsData[key], key)
      this.menuItems.push(newMenuItem)
      fragment.appendChild(newMenuItem.item)
    }

    this.element.appendChild(fragment)
  }
}

class AsideMenu extends Menu {
  constructor(itemsData, element) {
    super(itemsData, element)
  }

  createMenuItem(item) {
    const { id, element, textContent } = item
    const menuItem = document.createElement('li')
    menuItem.classList.add('aside-menu-item')

    menuItem.id = 'text-nav-' + id
    menuItem.dataset.id = 'text-nav-' + id
    element.dataset.id = 'text-nav-' + id

    menuItem.textContent = textContent

    menuItem.addEventListener('click', () => element.scrollIntoView({ block: "center", behavior: "smooth" }))

    return {
      item: menuItem,
      targetElement: item.element,
      id: item.id,
      active: false
    }
  }

  toggleActive(value, menuItem) {
    if (menuItem.active != value) {
      if (value) {
        menuItem.item.classList.add('active')
      }
      else {
        menuItem.item.classList.remove('active')
      }
      menuItem.active = value
    }
  }
}

class Slider {
  constructor(itemsData, element) {
    this.itemsData = itemsData
    this.element = element
    this.items = []
    this.sliderContent = this.element.querySelector('.slider-content .row')
    this.arrowLeft = this.element.querySelector('.arrow-left')
    this.arrowRight = this.element.querySelector('.arrow-right')

    this.createSlider()
    this.arrowLeft.classList.add('disabled')
    this.arrowLeft.addEventListener('click', this.onLeftArrowClick.bind(this))
    this.arrowRight.addEventListener('click', this.onRightArrowClick.bind(this))
  }

  createSlider() {
    let showing = 3
    if (this.element.offsetWidth > 1100) {
      showing = 4
    } 
    else if (this.element.offsetWidth < 500) {
      showing = 1
    }
    else if (this.element.offsetWidth < 760) {
      showing = 2
    }
    
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < this.itemsData.length; i++) {
      const card = document.createElement('div')
      const title = document.createElement('h5')
      const text = document.createElement('div')

      title.textContent = this.itemsData[i].title
      text.textContent = this.itemsData[i].text

      card.classList = 'item column hide'
      card.append(title, text)

      fragment.appendChild(card)
      this.items.push({
        id: i,
        element: card,
        active: false
      })

      if (i < showing) {
        this.show(this.items[i])
      }
    }

    this.sliderContent.append(fragment)
  }

  onLeftArrowClick() {
    if (!this.items[0].active) {
      const statusArray = this.items.map(item => item.active)
      const first = statusArray.indexOf(true)
      const last = statusArray.lastIndexOf(true)
      this.show(this.items[first - 1])
      this.hide(this.items[last])

      this.updateArrowButtons()
    }
  }

  onRightArrowClick() {
    if (!this.items[this.items.length - 1].active) {
      const statusArray = this.items.map(item => item.active)
      const first = statusArray.indexOf(true)
      const last = statusArray.lastIndexOf(true)
      this.show(this.items[last + 1])
      this.hide(this.items[first])
      
      this.updateArrowButtons()
    }
  }

  show(item) {
    item.element.classList.remove('hide')
    item.active = true
  }
  hide(item) {
    item.element.classList.add('hide')
    item.active = false
  }

  updateArrowButtons() {
    if (this.items[0].active) {
      this.arrowLeft.classList.add('disabled')
    }
    else if (this.items[this.items.length - 1].active) {
      this.arrowRight.classList.add('disabled')
    }
    else {
      this.arrowLeft.classList.remove('disabled')
      this.arrowRight.classList.remove('disabled')
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const main = new Main(data)
  main.init()
})
