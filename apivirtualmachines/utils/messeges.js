const requireNamePasswordStatus = 'name, password и status должны быть заполнены';
const userAlreadyExist = 'Пользователь с таким name уже существует';

const serverErrorMessage = 'Ошибка на сервере';
const notFound = 'Запрашиваемый ресурс не найден';

const incorrectId = 'Неверный id';
const requireAllFields = 'все поля должны быть заполнены';
const userNotOwner = 'Вы не являетесь автором статьи';

const userNotFound = 'Нет пользователя с таким id';
const userNotAuth = 'Необходима авторизация';
const userWasDeleted = 'Пользователь был удален, необходимо зарегистрироваться заново';

const incorrectNameOrPassword = 'Неправильные почта или пароль';

const userCreated = 'Пользователь успешно создан!';

const requireOrderData = 'vCPU, vRAM and vHDD fields required';
const orderNotFound = 'Order not found';

const incorrectStatus = 'Your status does not allow you to perform an action';

module.exports = {
    requireNamePasswordStatus,
    incorrectNameOrPassword,
    userAlreadyExist,
    userCreated,

    serverErrorMessage,
    notFound,
    incorrectId,
    requireAllFields,
    userNotOwner,

    userNotFound,
    userNotAuth,
    userWasDeleted,

    requireOrderData,
    orderNotFound,

    incorrectStatus,

};
