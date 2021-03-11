exports.MockUser = {
    name: "Tester",
    last_name: "Tester",
    user_name: "test",
    password: "test1234",
    preferred_currency: "ars"
}

exports.MockLogin = {
    user_name: "test",
    password: "test"
}
exports.MockToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDdkZGI5NWY5NmQ5MWIyZmZiYmIwMSIsIm5hbWUiOiJSYW1pcm8iLCJsYXN0X25hbWUiOiJNYWNjaXVjaSIsInVzZXJfbmFtZSI6InJtYWNjaXVjaSIsInNlc3Npb25JZCI6IjE2MTUzNzk2OTIwMDA2MDQ3ZGRiOTVmOTZkOTFiMmZmYmJiMDEiLCJpYXQiOjE2MTUzNzk2OTIsImV4cCI6MTYxNTQ2NjA5Mn0.WB49qvqPF_OGqyK9HIa52U2IesklUZaRY7fCen2YEUPkcvHyfv6zCm9pwvYOmWxaLnPqm2ltT27dWx9ts2A8szhoPN6ZnFYuuqiilS6jh1klIwgY1QbiVpFHtoB8G2D5Y8sx_BWnpQ8Eu-afgaTz-1nsD-299Aqc7TKuSaJjeorJF6MK1AAY72XLuLI-Zy9wfMNSooHS-mDbhs6_ZyikZqbrJsJeF-4TqkLkjoaLk18uProXDK10-NLcCOhdAmakbpVMO_AWKbpIA2y5uAwIGKW7MzzSrSrR4GeqMd2oqhxMhsEG5Rm0p3f57g8c7qo8HdoJAm8BNQuwNvJbumFzgQ";

exports.MockCreateUser = {
    Success: true,
    Message: 'Registro creado correctamente',
    HttpCodeResponse: 200,
    Data: {
        id: '60491d207377770e36122658',
        name: 'Tester',
        last_name: 'Tester',
        user_name: 'test',
        createdAt: '2021-03-10T19:25:20.406Z',
        updatedAt: '2021-03-10T19:25:20.406Z',
        preferred_currency: 'ars'
    },
    loggedUser: false
}