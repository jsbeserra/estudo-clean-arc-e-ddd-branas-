import { describe, expect, test } from "vitest";
import Coupon from "../../../../src/domain/entity/Coupon";
import FixedFreigthCalculator from "../../../../src/domain/entity/FixedFreigthCalculator";
import Item from "../../../../src/domain/entity/Item";
import Order from "../../../../src/domain/entity/Order";


describe("Account", () => {
    test("Deve criar um pedido com CPF válido", () => {
        const cpf = "839.435.452-10"
        const order = new Order(cpf)
        const total = order.getTotal()
        expect(total).toBe(0)
    })

    test("Deve tentar pedido com CPF inválido", () => {
        const cpf = "111.111.111-11"
        expect(() => new Order(cpf)).toThrow(new Error("Invalid cpf"))
    })

    test("Deve criar um pedido com 3 items", () => {
        const cpf = "839.435.452-10"
        const order = new Order(cpf)
        order.addItem(new Item(1, "Música", "CD", 30), 3)
        order.addItem(new Item(2, "Vídeo", "DVD", 50), 1)
        order.addItem(new Item(3, "Música", "MP3", 10), 2)
        const total = order.getTotal()
        expect(total).toBe(160)
    })

    test("Deve criar um pedido com 3 items com um cupom de desconto", () => {
        const cpf = "839.435.452-10"
        const order = new Order(cpf)
        order.addItem(new Item(1, "Música", "CD", 30), 3)
        order.addItem(new Item(2, "Vídeo", "DVD", 50), 1)
        order.addItem(new Item(3, "Música", "MP3", 10), 2)
        order.addCoupon(new Coupon("VALE20",20))
        const total = order.getTotal()
        expect(total).toBe(128)
    })
    
    test("Deve criar um pedido com 3 items com um cupom de desconto expirado", () => {
        const cpf = "839.435.452-10"
        const order = new Order(cpf, new Date('2021-12-10'))
        order.addItem(new Item(1, "Música", "CD", 30), 3)
        order.addItem(new Item(2, "Vídeo", "DVD", 50), 1)
        order.addItem(new Item(3, "Música", "MP3", 10), 2)
        order.addCoupon(new Coupon("VALE20",20, new Date('2021-12-01')))
        const total = order.getTotal()
        expect(total).toBe(160)
    })

    test("Deve criar um pedido com 3 items com um calculo de frete com estrategia default", () => {
        const cpf = "839.435.452-10"
        const order = new Order(cpf)
        order.addItem(new Item(4, "Instrumentos musicais", "violão", 1000,100,30,10,3), 1)
        order.addItem(new Item(5, "Instrumentos musicais", "amplificador", 5000,100,50,50,20), 1)
        order.addItem(new Item(6 , "Instrumentos musicais", "cabo", 30,10,10,10,0.9), 3)
        const freight = order.getFreight()
        expect(freight).toBe(260)
    })

    test("Deve criar um pedido com 3 items com um calculo de frete com estrategia default fixa", () => {
        const cpf = "839.435.452-10"
        const order = new Order(cpf,new Date(), new FixedFreigthCalculator())
        order.addItem(new Item(4, "Instrumentos musicais", "violão", 1000,100,30,10,3), 1)
        order.addItem(new Item(5, "Instrumentos musicais", "amplificador", 5000,100,50,50,20), 1)
        order.addItem(new Item(6 , "Instrumentos musicais", "cabo", 30,10,10,10,0.9), 3)
        const freight = order.getFreight()
        expect(freight).toBe(50)
    })
})