using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using my_new_app.Data;
using my_new_app.Services;
using System.Text;
using my_new_app.Repositories;
using Microsoft.OpenApi.Models;
using my_new_app.Services.ItemService;
using my_new_app.Services.ItemService.FileService;
using my_new_app.Data;
using my_new_app.Repositories;
using my_new_app.Hubs;
using System.Security.Cryptography.Xml;
using NuGet.Packaging.Signing;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json.Serialization;
using MailKit;
using IMailService = MailKit.IMailService;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Hangfire;


var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddDbContext<MyApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
    options.ConfigureWarnings(warnings =>
    warnings.Ignore(CoreEventId.NavigationBaseIncludeIgnored));
    });

builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

//hangfire initialization
builder.Services.AddHangfire(config => config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                                             .UseSimpleAssemblyNameTypeSerializer()
                                             .UseRecommendedSerializerSettings()
                                             .UseSqlServerStorage(builder.Configuration.GetSection("ConnectionStrings:DefaultConnection").Value));
//Hangfire server
builder.Services.AddHangfireServer();

builder.Services.AddSingleton<IUserIdProvider, CustomIdProvider>();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "jwtToken_Auth_API",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT Token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});
builder.Services.AddScoped<IEmailService, EmailService>();


// For adding Identity
builder.Services.AddIdentity<User, IdentityRole>(options =>

{
    options.Password.RequiredLength = 5;
    options.User.AllowedUserNameCharacters =
        "üğişçöı abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
}).AddEntityFrameworkStores<MyApplicationDbContext>().AddDefaultTokenProviders();

builder.Services.AddTransient<IAuthService, AuthService>();
// For Authentication

var secret = builder.Configuration["JWT:Secret"] ?? throw new InvalidOperationException("Secret not configured");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        RequireExpirationTime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration.GetSection("Jwt:Issuer").Value,
        ValidAudience = builder.Configuration.GetSection("Jwt:Audience").Value,
        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAny",
        builder => builder
            .WithOrigins("https://localhost:44442")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()  // If you are using credentials (e.g., cookies)
            .WithExposedHeaders("Authorization"));  // Add any additional headers you want to expose
});
builder.Services.AddDbContext<MyApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllersWithViews().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddScoped<IItemRepository<SalesItem>, ItemRepository<SalesItem>>();
builder.Services.AddScoped<IItemRepository<DonationItem>, ItemRepository<DonationItem>>();
builder.Services.AddScoped<IItemRepository<LendItem>, ItemRepository<LendItem>>();
builder.Services.AddScoped<IItemRepository<FoundItem>, ItemRepository<FoundItem>>();
builder.Services.AddScoped<IItemRepository<LostItem>, ItemRepository<LostItem>>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ISalesItemService, SalesItemService>();
builder.Services.AddScoped<IDonationItemService, DonationItemService>();
builder.Services.AddScoped<ILendItemService, LendItemService>();
builder.Services.AddScoped<IFoundItemService, FoundItemService>();
builder.Services.AddScoped<ILostItemService, LostItemService>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();


app.UseRouting();

app.UseCors("AllowAny");
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();

app.MapHub<ChatHub>("/chatHub");



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapControllerRoute(
    name: "default",
    pattern: "{controller = Home}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseHangfireDashboard();
app.MapHangfireDashboard("/hangfire");

app.Run();