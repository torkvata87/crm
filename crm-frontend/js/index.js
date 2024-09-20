import { ClientsTable } from "./ClientsTable.js";

/**
 * Инициализация таблицы клиентов и обработчиков событий при загрузке документа.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-req");
  const inputSearch = document.getElementById("inp-req");
  const btnAddNewContact = document.getElementById("btn-add");

  // Создание экземпляра класса ClientsTable.
  const table = new ClientsTable("tableClients");

  // Получение данных клиентов с сервера и отображение их в таблице
  await table.fetchClients();

  // Предотвращение отправки формы при нажатии на Enter и обновление страницы.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  // Добавляет обработчик события ввода для поиска клиентов по введенным данным.
  // Каждый раз, когда пользователь вводит текст, вызывается метод поиска клиентов в таблице.
  table.handlerFindClient(inputSearch);

  //  Добавляет обработчик события клика для добавления нового клиента.
  //  При нажатии на кнопку "Добавить новый контакт" вызывается метод добавления клиента.
  btnAddNewContact.addEventListener("click", () => {
    table.handleAddClick();
  });
});
