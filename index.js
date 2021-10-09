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
  }

  init() {
    this.dom = document.querySelector('#team-moscow-content')

    this.isDefault = this.dom.classList.contains('default')

    this.generateTopMenu()

    if (this.isDefault) {
      this.UI.leftMenu = this.dom.querySelector('#nav-left .left-menu')
      this.generateLeftMenu()
    }
  }

  generateTopMenu() {
    const { menu } = this.data
    this.UI.topMenu = new Menu(menu, this.dom.querySelector('#top-nav-menu'))
    this.UI.bottomMenu = new Menu(menu, this.dom.querySelector('#bottom-nav-menu'))
  }

  generateLeftMenu() {
    const headings = Array.from(this.dom.querySelectorAll('.heading2'))
    let fragment = document.createDocumentFragment()
    for (const heading of headings) {
      const li = document.createElement('li')
      li.textContent = heading.textContent
      fragment.appendChild(li)
    }
    this.UI.leftMenu.appendChild(fragment)
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

document.addEventListener('DOMContentLoaded', () => {
  const main = new Main(data)
  main.init()
})

