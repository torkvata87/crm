const SERVER_URL = "http://localhost:3000";

/**
 * Обрабатывает ответ сервера и возвращает данные в случае успеха.
 * Выбрасывает ошибки для кодов 404, 422 и 5xx.
 */
async function handleServerResponse(response) {
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    if (response.status === 404) {
      throw new Error("Страница со списком клиентов не найдена.");
    } else if (response.status === 422) {
      throw new Error(
        "Неверные данные. К сожалению, ваши данные не могут быть обработаны. Попробуйте отредактировать их."
      );
    } else if (response.status === 500) {
      throw new Error(
        "Из-за проблем на сервере ваши данные не могут быть обработаны. Попробуйте повторить ввод или зайдите сюда позднее."
      );
    } else {
      throw new Error("Что-то пошло не так...");
    }
  }
}

/**
 * Получает список клиентов с сервера.
 */
export async function serverGetClients() {
  try {
    let response = await fetch(SERVER_URL + "/api/clients", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Ошибка:", error.message);
    throw error;
  }
}

/**
 * Добавляет нового клиента на сервер.
 */
export async function serverAddClient(obj) {
  const response = await fetch(SERVER_URL + "/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  console.log(response.status);

  return await handleServerResponse(response);
}

/**
 * Изменяет данные клиента на сервере по его ID.
 */
export async function serverChangeClient(id, newData) {
  let response = await fetch(SERVER_URL + "/api/clients/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  });
  console.log(response.status);
  return await handleServerResponse(response);
}

/**
 * Удаляет клиента с сервера по его ID.
 */
export async function serverDeleteClient(id) {
  const response = await fetch(SERVER_URL + "/api/clients/" + id, {
    method: "DELETE",
  });
  console.log(response.status);
  return await handleServerResponse(response);
}
