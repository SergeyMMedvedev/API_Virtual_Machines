const requireNamePasswordStatus = 'Name, password and status must be filled';
const userAlreadyExist = 'A user with this name already exists';

const serverErrorMessage = 'Server error';
const notFound = 'The requested resource is not found';

const incorrectId = 'Invalid id';
const requireAllFields = 'All fields must be filled';

const userNotFound = 'Нет пользователя с таким id';
const userNotAuth = 'Authorization required';
const userWasDeleted = 'Пользователь был удален, необходимо зарегистрироваться заново';

const incorrectNameOrPassword = 'Incorrect name or password';

const userCreated = 'User has been successfully created!';

const requireOrderData = 'vCPU, vRAM and vHDD fields required';
const orderNotFound = 'Order not found';

const incorrectStatus = 'Your status does not allow you to perform an action';
const notOwnOrder = 'You do not have an order with the specified number';

module.exports = {
    requireNamePasswordStatus,
    incorrectNameOrPassword,
    userAlreadyExist,
    userCreated,

    serverErrorMessage,
    notFound,
    incorrectId,
    requireAllFields,

    userNotFound,
    userNotAuth,
    userWasDeleted,

    requireOrderData,
    orderNotFound,

    incorrectStatus,
    notOwnOrder,

};
