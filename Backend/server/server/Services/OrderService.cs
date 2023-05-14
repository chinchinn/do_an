using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using server.Data;
using server.enums;
using server.Helper.order;
using server.Interfaces;
using server.Models;
using server.ViewModel;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace server.Services
{
    public class OrderService : IOrderService
    {
        private readonly ShopDbContext _context;
        public OrderService(ShopDbContext context)
        {
            _context = context;
        }

        public async Task<int> Create(OrderCreateRequest request)
        {
            using (var trans = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var check = false;

                    foreach (var item in request.OrderDetails)
                    {

                        check = await _context.products.AnyAsync(x => x.amount >= item.quantity);

                        if (!check)
                        {
                            break;
                        }
                    }

                    if (check)
                    {
                        var order = new Order()
                        {
                            address = request.address,

                            createDate = DateTime.Now,
                            guess = request.guess,
                            phone = request.phone,
                            email = request.email,
                            note = request.note,
                            feeShip = request.feeShip,
                            deliveryDate = request.feeShip == 20000 ? DateTime.Now.AddDays(1) : DateTime.Now.AddDays(3),
                            status = enums.OrderStatus.NotConfirm,
                            total = request.total,
                            userId = request.userId,
                            OrderDetails = request.OrderDetails
                        };
                        await _context.orders.AddAsync(order);

                        await _context.SaveChangesAsync();

                        foreach (var item in request.OrderDetails)
                        {

                            var product = await _context.products.FirstAsync(x => x.id == item.productId);
                            product.amount = product.amount - item.quantity;
                            _context.Entry(product).State = EntityState.Modified;
                            await _context.SaveChangesAsync();
                        }
                        await trans.CommitAsync();
                        return order.id;
                    }
                }
                catch (Exception ex)
                {
                    await trans.RollbackAsync();
                    return -1;

                }
            }
            return -1;
        }

        public async Task<List<OrderViewModel>> GetOrderListByUserId(Guid userId)
        {
            var data = await _context.orders.Where(x => x.userId == userId && x.status != OrderStatus.Cancel)
            .Select(y => new OrderViewModel
            {
                id = y.id,
                address = y.address,
                createDate = y.createDate,
                deliveryDate = y.deliveryDate,
                email = y.email,
                guess = y.guess,
                note = y.note,
                feeShip = y.feeShip,
                OrderDetails = y.OrderDetails,
                phone = y.phone,
                status = y.status,
                street = y.street,
                total = y.total,
                user = y.user,
                userId = y.userId.Value,
            }).ToListAsync();
            return data;
        }
    }
}
