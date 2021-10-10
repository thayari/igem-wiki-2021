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

    this.isDefault = false
    this.isScrolling = false
  }

  init() {
    this.dom = document.querySelector('#team-moscow-content')

    this.isDefault = this.dom.classList.contains('default')

    this.generateMainMenu()

    if (this.isDefault) {
      this.generateLeftMenu()
    }

    window.addEventListener("scroll", (e) => this.throttleScroll.bind(this), false);
  }

  throttleScroll(e) {
    console.log(e)
    if (this.isScrolling == false) {
      window.requestAnimationFrame(function () {
        this.onScroll(e);
        this.isScrolling = false;
      });
    }
    this.isScrolling = true;
  }

  onScroll(e) {
    console.log('111')
    if (this.isDefault && this.UI.leftMenu) {
      console.log(this.UI.leftMenu.menuItems)
    }
  }

  generateMainMenu() {
    const { menu } = this.data
    this.UI.topMenu = new Menu(menu, this.dom.querySelector('#top-nav-menu'))
    this.UI.bottomMenu = new Menu(menu, this.dom.querySelector('#bottom-nav-menu'))
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
  constructor(itemsData, element) {
    this.itemsData = itemsData
    this.element = element
    this.menuItems = []

    this.createMenu()
  }

  createMenuItem(item, key) {
    const menuItem = document.createElement('li')
    const link = document.createElement('a')
    const dropdown = document.createElement('ul')

    menuItem.classList.add('nav-menu-item')
    dropdown.classList.add('nav-menu-dropdown')

    menuItem.id = key

    link.href = item.href
    link.textContent = item.title

    if (item.content) {
      let html = ''
      item.content.forEach(element => {
        html += `<li><a href="${element[1]}">${element[0]}</a></li>`
      });
      dropdown.innerHTML = html
    }

    menuItem.append(link, dropdown)

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
      id: item.id
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const main = new Main(data)
  main.init()
})
