import {
  imgBtnDeleteInput,
  applyMask,
  validateContact,
  valueObjContacts,
  getContactIconHTML,
  getContactType,
} from "./utils.js";

/**
 * Класс для управления контактами.
 */
export class Contact {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  /**
   * Создает ссылки контактов в зависиости от их типа.
   */
  contactFormat(blockCSS, linkCSS) {
    const blockContact = document.createElement("div");
    blockContact.classList.add(blockCSS);
    blockContact.textContent = `${this.type}: `;

    const linkValue = document.createElement("a");
    linkValue.href = `${getContactType(this.type)}${this.value}`;

    if (linkValue.href.startsWith("http")) linkValue.target = "_blank";

    linkValue.textContent = this.value;
    linkValue.classList.add(linkCSS);

    blockContact.append(linkValue);
    return blockContact;
  }

  /**
   * Создает блок с иконкой и всплывающей подсказкой контакта.
   */
  createContactIcon() {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.setAttribute("tabindex", "0");

    const contactIcon = document.createElement("div");
    contactIcon.classList.add("tooltip__icon");
    contactIcon.innerHTML = getContactIconHTML(this.type);

    const tooltipContact = this.contactFormat(
      "tooltip__block-contact",
      "tooltip__link-value"
    );

    tooltip.append(contactIcon, tooltipContact);
    this.addEventListenersTooltip(tooltip, tooltipContact);

    return tooltip;
  }

  // applyMask(input) {
  //   let maskOptions;

  //   switch (input.dataset.val) {
  //     case "tel":
  //     case "tel-add":
  //       maskOptions = { mask: "+7 (999) 999-99-99" };
  //       break;
  //     case "email":
  //       maskOptions = { alias: "email" };
  //       break;
  //     case "url":
  //       maskOptions = { alias: "url" };
  //       break;
  //     case "other":
  //       maskOptions = { mask: "" };
  //       break;
  //   }

  //   Inputmask(maskOptions).mask(input);
  // }
  applyMask(input) {
    const masks = {
      tel: { mask: "+7 (999) 999-99-99" },
      "tel-add": { mask: "+7 (999) 999-99-99" },
      email: { alias: "email" },
      url: { alias: "url" },
      other: { mask: "" },
    };

    const maskOptions = masks[input.dataset.val] || { mask: "" };
    Inputmask(maskOptions).mask(input);
  }

  /**
   * Добавляет обработчики событий для управления видимостью всплывающих подсказок.
   */
  addEventListenersTooltip(tooltip, tooltipContact) {
    // Обработчик события скрытия всех всплывающих подсказок и показа всплывающей подсказки только для данного контакта при наведении мыши на контакт
    tooltip.addEventListener("mouseenter", () => {
      const tooltipContactAll = document.querySelectorAll(
        ".tooltip__block-contact"
      );
      tooltipContactAll.forEach((tooltipContact) => {
        tooltipContact.classList.remove("opacity-visible");
      });
      tooltipContact.classList.add("opacity-visible");
    });

    // Обработчик события скрытия всплывающей подсказки при снятии курсора мыши с иконки контакта и всплывающей подсказки
    tooltip.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!tooltip.contains(document.activeElement)) {
          tooltipContact.classList.remove("opacity-visible");
        }
      }, 100);
    });

    // Обработчик события показа всплывающей подсказки при нажатии на "Tab"
    tooltip.addEventListener("keyup", (event) => {
      if (event.key === "Tab") {
        tooltipContact.classList.add("opacity-visible");
      }
    });

    // Обработчик события скрытия всплывающей подсказки при потери фокуса иконки контакта
    tooltip.addEventListener("focusout", () => {
      setTimeout(() => {
        if (!tooltip.contains(document.activeElement)) {
          tooltipContact.classList.remove("opacity-visible");
        }
      }, 100);
    });
  }

  /**
   * Создает инпут для контакта с выпадающим списком выбора его типа.
   */
  createContactInput(contacts) {
    const formBlockAddContacts = document.getElementById("block-contact");

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("form__input-container");

    const dropDownContainer = document.createElement("div");
    dropDownContainer.classList.add("form__dropdown__container");

    const dropDownBtn = document.createElement("button");
    dropDownBtn.type = "button";
    dropDownBtn.classList.add(
      "dropdown__button",
      "dropdown__button-down",
      "btn-reset"
    );
    dropDownBtn.dataset.select = "default-contact";
    dropDownBtn.setAttribute("aria-expanded", "false");
    dropDownBtn.setAttribute("aria-haspopup", "listbox");
    dropDownBtn.textContent = this.type ? this.type : "Телефон";

    const dropDownList = document.createElement("ul");
    dropDownList.role = "listbox";
    dropDownList.setAttribute("aria-labelledby", "select-button");
    dropDownList.classList.add("dropdown__list", "list-reset");

    // const valueList = [
    //   { value: "tel", text: "Телефон" },
    //   { value: "tel-add", text: "Доп. телефон" },
    //   { value: "email", text: "Email" },
    //   { value: "url", text: "Vk" },
    //   { value: "url", text: "Facebook" },
    //   { value: "other", text: "Другое" },
    // ];

    const inputText = document.createElement("input");
    inputText.dataset.val =
      valueObjContacts[dropDownBtn.textContent.toLowerCase()];
    inputText.type = "text";

    Object.keys(valueObjContacts).forEach((key) => {
      // if (dropDownBtn.textContent === elem.text) {
      //   inputText.dataset.val = elem.value;
      //   inputText.type = elem.value === "text";
      // }

      const listItem = document.createElement("li");
      listItem.role = "option";
      listItem.tabIndex = "0";
      listItem.classList.add("dropdown__list-item");
      listItem.dataset.value = valueObjContacts[key];
      listItem.textContent =
        key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      dropDownList.append(listItem);
    });

    inputText.classList.add("form__input-contact");
    inputText.value = this.value ? this.value : "";
    // inputText.name = "select-category";

    inputText.placeholder = "Введите данные контакта";

    const btnDeleteInput = document.createElement("button");
    btnDeleteInput.classList.add("form__btn-close-contact", "hidden");
    btnDeleteInput.type = "button";
    btnDeleteInput.innerHTML = imgBtnDeleteInput;

    dropDownContainer.append(dropDownBtn, dropDownList);
    inputContainer.append(dropDownContainer, inputText, btnDeleteInput);
    formBlockAddContacts.append(inputContainer);

    setTimeout(() => {
      inputContainer.classList.add("opacity");
    }, 10);

    this.applyMask(inputText);

    document.addEventListener("click", (event) =>
      this.handleDocumentClick(event)
    );
    dropDownBtn.addEventListener("click", (event) => this.handlerSelect(event));
    btnDeleteInput.addEventListener("click", () => {
      this.handlerBtnDeleteInput(inputContainer);
    });

    const items = dropDownList.querySelectorAll(".dropdown__list-item");
    items.forEach((item) => {
      item.addEventListener("click", (event) => {
        this.handlerItemContact(event, contacts);
      });
    });

    this.addEventListenersInputText(inputText);
    return formBlockAddContacts;
  }

  /**
   * Добавляет обработчики событий для инпута контакта.
   */
  addEventListenersInputText(inputText) {
    // Обработчик события при фокусе инпута с удалением подсвечивания красным при неверном вводе данных контакта, а также показа кнопки удаления инпута и смена флажка раскрытия выпадающего списка
    inputText.addEventListener("focus", (event) => {
      event.currentTarget.classList.remove("input-error");

      const btnDeleteInput = event.currentTarget.nextSibling;
      btnDeleteInput.classList.remove("hidden");
      setTimeout(() => btnDeleteInput.classList.add("opacity-width"), 10);

      const dropDownLists = document.querySelectorAll(".dropdown__list");
      dropDownLists.forEach((list) => {
        list.classList.remove("dropdown__list-visible");
      });

      const dropDownBtns = document.querySelectorAll(".dropdown__button");
      dropDownBtns.forEach((btn) =>
        btn.classList.remove("dropdown__button-up")
      );
    });

    // Обработчик события с потерей фокуса инпута с добавлением подсвечиванием красным при неверном вводе данных контакта
    inputText.addEventListener("blur", (event) => {
      let value = event.currentTarget.value;
      const type = event.currentTarget.dataset.val;

      if (!validateContact(type, value)) {
        event.currentTarget.classList.add("input-error");
      } else {
        event.currentTarget.classList.remove("input-error");
      }
    });

    // Обработчик события удаления всех символов из инпута при вводе текста, которые не отвечают заданному типу контакта
    inputText.addEventListener("keyup", (event) => {
      let value = event.currentTarget.value;
      if (event.currentTarget.dataset.val !== "other")
        value = value.replace(/[^/:a-z0-9@._-]/g, "").replace(/[-\s]+$/g, "");
      value = value.replace(/[.]+/g, ".").replace(/^[-\s]+/g, "");
      event.currentTarget.value = value;
    });
  }

  /**
   * Обработчик для открытия и закрытия выпадающего списка при клике на кнопку.
   */
  handlerSelect(event) {
    const dropDownBtn = event.currentTarget;
    const dropDownList = dropDownBtn.nextSibling;

    dropDownBtn.classList.toggle("dropdown__button-up");
    dropDownList.classList.toggle("dropdown__list-visible");

    const items = Array.from(
      dropDownBtn.parentNode.querySelectorAll(".dropdown__list-item")
    );

    const itemHidden = items.find(
      (elem) => elem.textContent === dropDownBtn.textContent
    );
    itemHidden.classList.add("hidden");
  }

  /**
   * Обработчик выбора элемента из выпадающего списка контактов.
   */
  handlerItemContact(event, contacts) {
    const dropDownBtn = event.currentTarget.parentNode.previousSibling;
    dropDownBtn.textContent = event.currentTarget.textContent;

    const items = Array.from(
      dropDownBtn.parentNode.querySelectorAll(".dropdown__list-item")
    );

    event.target.parentNode.classList.remove("dropdown__list-visible");
    items.forEach((i) => i.classList.remove("hidden"));
    items
      .find((i) => i.textContent === dropDownBtn.textContent)
      .classList.add("hidden");

    const inputText = dropDownBtn.parentNode.nextSibling;
    if (contacts) {
      const contactInput = contacts.find(
        (contact) => contact.type === dropDownBtn.textContent
      );
      inputText.value = contactInput ? contactInput.value : "";
    } else {
      inputText.value = "";
    }
    inputText.dataset.val = event.target.dataset.value;
    inputText.type = "text";

    applyMask(inputText);
  }

  /**
   * Обработчик кликов по документу для закрытия выпадающих списков при клике вне их.
   */
  handleDocumentClick(event) {
    const dropDownLists = document.querySelectorAll(".dropdown__list");
    dropDownLists.forEach((list) => {
      if (!list.parentNode.contains(event.target))
        list.classList.remove("dropdown__list-visible");

      const dropDownBtns = document.querySelectorAll(".dropdown__button");
      dropDownBtns.forEach((btn) => {
        if (!btn.parentNode.contains(event.target))
          btn.classList.remove("dropdown__button-up");
      });
    });
  }

  /**
   * Обработчик удаления инпута контакта.
   */
  handlerBtnDeleteInput(inputContainer) {
    inputContainer.classList.remove("opacity");

    setTimeout(() => {
      inputContainer.remove();

      const inputs = document.querySelectorAll("input[data-val]");
      const btnAddNewContact = document.querySelector(".form__btn-add-contact");
      const blockAddContacts = document.querySelector(
        ".form__block-add-contact"
      );

      if (inputs.length < 10) {
        btnAddNewContact.classList.remove("hidden");
        blockAddContacts.classList.add("add-padding-bottom");
      }

      if (inputs.length === 0) {
        blockAddContacts.classList.remove(
          "form__block-add-contact-padding",
          "add-padding-bottom"
        );
        const formBlockAddContacts = document.getElementById("block-contact");
        formBlockAddContacts.remove();
      }

      if (inputs.length < 4) {
        const formBlockAddContacts = document.querySelector(
          ".form__block-contacts"
        );
        formBlockAddContacts.classList.remove("form_block-contacts-scroll");
      }
    }, 300);
  }
}
// import {
//   imgVk,
//   imgFb,
//   imgPhone,
//   imgEmail,
//   imgOther,
//   imgBtnDeleteInput,
// } from "./utils.js";

// export class Contact {
//   constructor(type, value) {
//     this.type = type;
//     this.value = value;
//   }

//   validateContact(type, value) {
//     const validationRules = {
//       tel: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
//       "tel-add": /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
//       email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
//       url: /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[a-zA-Z0-9.-]*)*\/?$/i,
//       other: /^[\w\s.@:-]+$/,
//     };
//     return validationRules[type] ? validationRules[type].test(value) : true;
//   }

//   applyMask(input) {
//     let maskOptions;

//     switch (input.dataset.val) {
//       case "tel":
//       case "tel-add":
//         maskOptions = { mask: "+7 (999) 999-99-99" };
//         break;
//       case "email":
//         maskOptions = { alias: "email" };
//         break;
//       case "url":
//         maskOptions = { alias: "url" };
//         break;
//       case "other":
//         maskOptions = { mask: "" };
//         break;
//     }

//     Inputmask(maskOptions).mask(input);
//   }

//   getContactIconHTML(type) {
//     const contactIcons = {
//       vk: imgVk,
//       facebook: imgFb,
//       телефон: imgPhone,
//       "доп. телефон": imgPhone,
//       email: imgEmail,
//       другое: imgOther,
//     };

//     return contactIcons[type.toLowerCase()] || contactIcons.other;
//   }
//   getContactType(type) {
//     const contactType = {
//       vk: "",
//       facebook: "",
//       телефон: "tel:",
//       "доп. телефон": "tel:",
//       email: "mailto:",
//       // другое: '<img src="./img/other.svg" alt="Другое">',
//     };
//     return contactType[type.toLowerCase()];
//   }

//   contactFormat(blockCSS, linkCSS) {
//     const blockContact = document.createElement("div");
//     blockContact.classList.add(blockCSS);
//     blockContact.textContent = `${this.type}: `;

//     const linkValue = document.createElement("a");
//     linkValue.href = `${this.getContactType(this.type)}${this.value}`;

//     if (linkValue.href.startsWith("http")) linkValue.target = "_blank";

//     linkValue.textContent = this.value;
//     linkValue.classList.add(linkCSS);

//     blockContact.append(linkValue);
//     return blockContact;
//   }

//   createContactIcon() {
//     const tooltip = document.createElement("div");
//     tooltip.classList.add("tooltip");
//     tooltip.setAttribute("tabindex", "0");

//     const contactIcon = document.createElement("div");
//     contactIcon.classList.add("tooltip__icon");
//     contactIcon.innerHTML = this.getContactIconHTML(this.type);
//     const tooltipContact = this.contactFormat(
//       "tooltip__block-contact",
//       "tooltip__link-value"
//     );

//     tooltip.append(contactIcon, tooltipContact);
//     tooltip.addEventListener("mouseenter", () => {
//       const tooltipContactAll = document.querySelectorAll(
//         ".tooltip__block-contact"
//       );

//       tooltipContactAll.forEach((tooltipContact) => {
//         // tooltipContact.style.opacity = "0";
//         // tooltipContact.style.visibility = "hidden";
//         tooltipContact.classList.remove("opacity-visible");
//       });

//       // tooltipContact.style.opacity = "1";
//       // tooltipContact.style.visibility = "visible";
//       tooltipContact.classList.add("opacity-visible");
//     });

//     tooltip.addEventListener("mouseleave", () => {
//       setTimeout(() => {
//         if (!tooltip.contains(document.activeElement)) {
//           // tooltipContact.style.opacity = "0";
//           // tooltipContact.style.visibility = "hidden";
//           tooltipContact.classList.remove("opacity-visible");
//         }
//       }, 100);
//     });

//     tooltip.addEventListener("keydown", (event) => {
//       if (event.key === "Tab") {
//         // tooltipContact.style.opacity = "1";
//         // tooltipContact.style.visibility = "visible";
//         tooltipContact.classList.add("opacity-visible");
//       }
//     });

//     tooltip.addEventListener("focusout", () => {
//       setTimeout(() => {
//         if (!tooltip.contains(document.activeElement)) {
//           // tooltipContact.style.opacity = "0";
//           // tooltipContact.style.visibility = "hidden";
//           tooltipContact.classList.remove("opacity-visible");
//         }
//       }, 100);
//     });

//     return tooltip;
//   }

//   createContactInput(contacts) {
//     const formBlockAddContacts = document.getElementById("block-contact");

//     const inputContainer = document.createElement("div");
//     inputContainer.classList.add("form__input-container");

//     const dropDownContainer = document.createElement("div");
//     dropDownContainer.classList.add("form__dropdown__container");

//     const dropDownBtn = document.createElement("button");
//     dropDownBtn.type = "button";
//     dropDownBtn.classList.add(
//       "dropdown__button",
//       "dropdown__button-down",
//       "btn-reset"
//     );
//     dropDownBtn.dataset.select = "default-contact";
//     dropDownBtn.setAttribute("aria-expanded", "false");
//     dropDownBtn.setAttribute("aria-haspopup", "listbox");
//     dropDownBtn.textContent = this.type ? this.type : "Телефон";

//     const dropDownList = document.createElement("ul");
//     dropDownList.role = "listbox";
//     dropDownList.setAttribute("aria-labelledby", "select-button");
//     dropDownList.classList.add("dropdown__list", "list-reset");

//     const valueList = [
//       { value: "tel", text: "Телефон" },
//       { value: "tel-add", text: "Доп. телефон" },
//       { value: "email", text: "Email" },
//       { value: "url", text: "Vk" },
//       { value: "url", text: "Facebook" },
//       { value: "other", text: "Другое" },
//     ];
//     const inputText = document.createElement("input");
//     valueList.forEach((elem) => {
//       if (dropDownBtn.textContent === elem.text) {
//         inputText.dataset.val = elem.value;
//         inputText.type = elem.value === "text";
//       }
//       const listItem = document.createElement("li");
//       listItem.role = "option";
//       listItem.tabIndex = "0";
//       listItem.classList.add("dropdown__list-item");
//       listItem.dataset.value = elem.value;
//       listItem.textContent = elem.text;
//       dropDownList.append(listItem);
//     });
//     inputText.classList.add("form__input-contact");
//     inputText.value = this.value ? this.value : "";
//     inputText.name = "select-category";

//     inputText.placeholder = "Введите данные контакта";

//     const btnDeleteInput = document.createElement("button");
//     btnDeleteInput.classList.add("form__btn-close-contact", "hidden");
//     btnDeleteInput.type = "button";
//     btnDeleteInput.innerHTML = imgBtnDeleteInput;

//     dropDownContainer.append(dropDownBtn, dropDownList);
//     inputContainer.append(dropDownContainer, inputText, btnDeleteInput);
//     formBlockAddContacts.append(inputContainer);

//     setTimeout(() => {
//       inputContainer.classList.add("opacity");
//     }, 10);
//     this.applyMask(inputText);

//     dropDownBtn.addEventListener("click", (event) => this.handlerSelect(event));

//     document.addEventListener("click", (event) =>
//       this.handleDocumentClick(event)
//     );

//     btnDeleteInput.addEventListener("click", () => {
//       this.handlerBtnDeleteInput(inputContainer);
//     });

//     const items = dropDownList.querySelectorAll(".dropdown__list-item");

//     items.forEach((item) => {
//       item.addEventListener("click", (event) => {
//         this.handlerItemContact(event, contacts);
//       });
//     });

//     this.addEventListenersInputText(inputText);
//     return formBlockAddContacts;
//   }

//   // addEventListenersInputText(inputText) {
//   //   inputText.addEventListener("focus", (event) => {
//   //     event.currentTarget.classList.remove("input-error");
//   //     const btnDeleteInput = event.currentTarget.nextSibling;
//   //     btnDeleteInput.classList.remove("hidden");

//   //     setTimeout(() => {
//   //       btnDeleteInput.classList.add("opacity");
//   //     }, 10);

//   //     const dropDownLists = document.querySelectorAll(".dropdown__list");
//   //     dropDownLists.forEach((list) => {
//   //       list.classList.remove("dropdown__list-visible");
//   //     });

//   //     const dropDownBtns = document.querySelectorAll(".dropdown__button");
//   //     dropDownBtns.forEach((btn) =>
//   //       btn.classList.remove("dropdown__button-up")
//   //     );
//   //   });

//   //   inputText.addEventListener("blur", (event) => {
//   //     let value = event.currentTarget.value;
//   //     const type = event.currentTarget.dataset.val;

//   //     if (!this.validateValue(type, value)) {
//   //       event.currentTarget.classList.add("input-error");
//   //     } else {
//   //       event.currentTarget.classList.remove("input-error");
//   //     }
//   //   });

//   //   inputText.addEventListener("keyup", (event) => {
//   //     let value = event.currentTarget.value;
//   //     if (event.currentTarget.dataset.val !== "other") {
//   //       value = value.replace(/[^/:a-z0-9@._-]/g, ""); // Удаляем все символы, кроме допустимых
//   //       value = value.replace(/[-\s]+$/g, ""); // Удаляем лишние пробелы и дефисы в начале и конце
//   //     }
//   //     value = value.replace(/[.]+/g, "."); // Заменяем несколько идущих подряд пробелов или дефисов на один
//   //     value = value.replace(/^[-\s]+/g, ""); // Удаляем лишние пробелы и дефисы в начале и конце
//   //     event.currentTarget.value = value;
//   //   });
//   // }
//   addEventListenersInputText(inputText) {
//     // Обработчик события при фокусе инпута с удалением подсвечивания красным при неверном вводе данных контакта, а также показа кнопки удаления инпута и смена флажка раскрытия выпадающего списка
//     inputText.addEventListener("focus", (event) => {
//       event.currentTarget.classList.remove("input-error");

//       const btnDeleteInput = event.currentTarget.nextSibling;
//       btnDeleteInput.classList.remove("hidden");
//       setTimeout(() => btnDeleteInput.classList.add("opacity-width"), 10);

//       const dropDownLists = document.querySelectorAll(".dropdown__list");
//       dropDownLists.forEach((list) => {
//         list.classList.remove("dropdown__list-visible");
//       });

//       const dropDownBtns = document.querySelectorAll(".dropdown__button");
//       dropDownBtns.forEach((btn) =>
//         btn.classList.remove("dropdown__button-up")
//       );
//     });

//     // Обработчик события с потерей фокуса инпута с добавлением подсвечиванием красным при неверном вводе данных контакта
//     inputText.addEventListener("blur", (event) => {
//       let value = event.currentTarget.value;
//       const type = event.currentTarget.dataset.val;

//       if (!this.validateContact(type, value)) {
//         event.currentTarget.classList.add("input-error");
//       } else {
//         event.currentTarget.classList.remove("input-error");
//       }
//     });

//     inputText.addEventListener("keyup", (event) => {
//       let value = event.currentTarget.value;
//       if (event.currentTarget.dataset.val !== "other") {
//         value = value.replace(/[^/:a-z0-9@._-]/g, ""); // Удаляем все символы, кроме допустимых
//         value = value.replace(/[-\s]+$/g, ""); // Удаляем лишние пробелы и дефисы в начале и конце
//       }
//       value = value.replace(/[.]+/g, "."); // Заменяем несколько идущих подряд пробелов или дефисов на один
//       value = value.replace(/^[-\s]+/g, ""); // Удаляем лишние пробелы и дефисы в начале и конце
//       event.currentTarget.value = value;
//     });
//   }

//   handlerSelect(event) {
//     const dropDownBtn = event.currentTarget;
//     const dropDownList = dropDownBtn.nextSibling;

//     dropDownBtn.classList.toggle("dropdown__button-up");
//     dropDownList.classList.toggle("dropdown__list-visible");

//     const items = Array.from(
//       dropDownBtn.parentNode.querySelectorAll(".dropdown__list-item")
//     );

//     const itemHidden = items.find(
//       (elem) => elem.textContent === dropDownBtn.textContent
//     );

//     itemHidden.classList.add("hidden");
//   }

//   handlerItemContact(event, contacts) {
//     const dropDownBtn = event.currentTarget.parentNode.previousSibling;
//     dropDownBtn.textContent = event.currentTarget.textContent;

//     const items = Array.from(
//       dropDownBtn.parentNode.querySelectorAll(".dropdown__list-item")
//     );

//     event.target.parentNode.classList.remove("dropdown__list-visible");
//     items.forEach((i) => i.classList.remove("hidden"));
//     items
//       .find((i) => i.textContent === dropDownBtn.textContent)
//       .classList.add("hidden");

//     const inputText = dropDownBtn.parentNode.nextSibling;
//     if (contacts) {
//       const contactInput = contacts.find(
//         (contact) => contact.type === dropDownBtn.textContent
//       );
//       inputText.value = contactInput ? contactInput.value : "";
//     } else {
//       inputText.value = "";
//     }
//     inputText.dataset.val = event.target.dataset.value;
//     inputText.type = "text";

//     this.applyMask(inputText);
//   }

//   handleDocumentClick(event) {
//     const dropDownLists = document.querySelectorAll(".dropdown__list");
//     dropDownLists.forEach((list) => {
//       if (!list.parentNode.contains(event.target))
//         list.classList.remove("dropdown__list-visible");

//       const dropDownBtns = document.querySelectorAll(".dropdown__button");
//       dropDownBtns.forEach((btn) => {
//         if (!btn.parentNode.contains(event.target))
//           btn.classList.remove("dropdown__button-up");
//       });
//     });
//   }

//   handlerBtnDeleteInput(inputContainer) {
//     inputContainer.classList.remove("opacity-width");

//     setTimeout(() => {
//       inputContainer.remove();

//       const inputs = document.querySelectorAll("input[data-val]");
//       const btnAddNewContact = document.querySelector(".form__btn-add-contact");
//       const blockAddContacts = document.querySelector(
//         ".form__block-add-contact"
//       );
//       if (inputs.length < 10) {
//         btnAddNewContact.classList.remove("hidden");
//         blockAddContacts.classList.add("add-padding-bottom");
//       }
//       if (inputs.length === 0) {
//         blockAddContacts.classList.remove(
//           "form__block-add-contact-padding",
//           "add-padding-bottom"
//         );
//         const formBlockAddContacts = document.getElementById("block-contact");
//         formBlockAddContacts.remove();
//       }

//       if (inputs.length < 4) {
//         const formBlockAddContacts = document.querySelector(
//           ".form__block-contacts"
//         );
//         formBlockAddContacts.classList.remove("form_block-contacts-scroll");
//       }
//     }, 300);
//   }
// }
