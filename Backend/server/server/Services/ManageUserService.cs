using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using MimeKit;
using server.Data;
using server.Helper;
using server.Helper.user;
using server.Interfaces;
using server.Models;
using server.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace server.Services
{
    public class ManageUserService : IManageUserService
    {
        private readonly ShopDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly EmailConfiguration _emailConfiguration;
        public ManageUserService(UserManager<AppUser> userManager, ShopDbContext context, EmailConfiguration emailConfiguration)
        {
            _context = context;
            _userManager = userManager;
            _emailConfiguration = emailConfiguration;
        }
        public async Task<bool> ChangeStatusUser(UserChangeStatusRequest request)
        {
            var user = await _context.Users.Where(x => x.Id == request.id).FirstOrDefaultAsync();
            user.status = request.status;
            _context.Entry(user).State = EntityState.Modified;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CreateUser(CreateUser request)
        {
            using (IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync())
            {
                var testUserExist = _context.Users.FirstOrDefault(u => u.Email == request.Email);
                if (testUserExist == null)
                {
                    var user = new AppUser()
                    {
                        displayname = request.UserName,
                        Email = request.Email,
                        UserName = request.Email,
                        birthDay = DateTime.Now,
                    };
                    var result = await _userManager.CreateAsync(user, request.PassWord);

                    if (result.Succeeded)
                    {
                        await transaction.CommitAsync();
                        bool isSend = await SendCheckAccount(request);

                        if (isSend)
                        {
                            var userRole = _context.Roles.FirstOrDefault(x => x.Id == Guid.Parse(request.RoleId));
                            await _userManager.AddToRoleAsync(user, userRole.Name);


                            transaction.Commit();
                            return true;
                        }
                        else
                        {
                            transaction.Rollback();
                        }


                    }
                }
            }
            return false;
        }

        private async Task<bool> SendCheckAccount(CreateUser request)
        {
            var userInsert = await _context.Users.Where(u => u.Email == request.Email).FirstOrDefaultAsync();
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(userInsert);

            var passwordResetLink = string.Format("http://localhost:3000/ResetPassword?token={0}&email={1}", token, request.Email);
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailConfiguration.From));
            //var to = new List<MailboxAddress>();

            emailMessage.To.Add(new MailboxAddress(request.Email));
            emailMessage.Subject = "CONFIRM ACCOUNT";


            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = string.Format("<a href='http://localhost:3000/ConfirmAccount?token={0}&email={1}'>Nhấp vào đây để xác thực</a>",
                    token, request.Email)
            };

            var isSend = await Send(emailMessage);
            return isSend;
        }

        private async Task<bool> Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.SslProtocols = SslProtocols.Ssl3 | SslProtocols.Tls | SslProtocols.Tls11 | SslProtocols.Tls12 | SslProtocols.Tls13;
                    client.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.Port, false);
                    await client.AuthenticateAsync(_emailConfiguration.Username, _emailConfiguration.Password);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.SendAsync(mailMessage);
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }

            }
        }


        public async Task<List<UserViewModel>> GetUserDisplayList(string id)
        {
            var query = from u in _context.Users
                        join ur in _context.UserRoles on u.Id equals ur.UserId
                        join r in _context.Roles on ur.RoleId equals r.Id
                        select new
                        {
                            u,
                            r.Name
                        };
            var data = await query.Where(x => x.u.Id != Guid.Parse(id)).Select(y => new UserViewModel
            {
                id = y.u.Id,
                address = y.u.address,
                avatar = y.u.avatar,
                birthDay = y.u.birthDay,
                displayname = y.u.displayname,
                email = y.u.Email,
                gender = y.u.gender,
                Orders = y.u.Orders,
                phone = y.u.phone,
                status = y.u.status,
                userType = y.u.UserName.Contains("facebook") ? "Facebook User" : "User",
                roleName = y.Name
            }).ToListAsync();
            return data;
        }

        public async Task<List<UserViewModel>> SearchUser(SearchUserRequest request)
        {
            var query = _context.Users.Where(x => x.Id != Guid.Parse(request.currentUserId)).AsQueryable();
            if (!string.IsNullOrEmpty(request.keyWord))
            {
                query = query.Where(x => x.displayname.ToLower().Contains(request.keyWord.ToLower()));
            }
            if (request.status != null)
            {
                query = query.Where(x => x.status == request.status);
            }
            return await query.Select(y => new UserViewModel
            {
                id = y.Id,
                address = y.address,
                avatar = y.avatar,
                birthDay = y.birthDay,
                displayname = y.displayname,
                email = y.Email,
                gender = y.gender,
                Orders = y.Orders,
                phone = y.phone,
                status = y.status,
                userType = y.UserName.Contains("facebook") ? "Facebook User" : "User"
            }).ToListAsync();
        }
    }
}
