using BOX.Models;
using Microsoft.EntityFrameworkCore;
using BOX.Controllers;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BOX.Factory;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;
using BOX.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(defaultPolicy =>
  {
    defaultPolicy.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
  });
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    In = ParameterLocation.Header,
    Description = "Add Bearer Token",
    Name = "Authorization",
    Type = SecuritySchemeType.Http,
    BearerFormat = "JWT",
    Scheme = "bearer"
  });
  c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference=new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{ }
        }
    });
});

// Add configuration for required password

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireUppercase = true; // Must have an uppercase letter
    options.Password.RequireLowercase = true; // Must have a lowercase letter
    options.Password.RequireNonAlphanumeric = false; // Don't need a special character
    options.Password.RequireDigit = true; // Must have a digit
    options.Password.RequiredLength = 8; // Password must have a minmum of 8 characters
    options.User.RequireUniqueEmail = true; // Requires a unique email
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Add configuration for required emails
builder.Services.Configure<IdentityOptions>(
    options => options.SignIn.RequireConfirmedEmail = true
    );

builder.Services.AddAuthentication()
                .AddCookie()
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = builder.Configuration["Tokens:Issuer"],
                        ValidAudience = builder.Configuration["Tokens:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Tokens:Key"]))
                    };
                });

//Add Email Configs

var configuration = builder.Configuration;
var emailConfig = configuration
    .GetSection("EmailConfiguration")
    .Get<EmailConfiguration>();
builder.Services.AddSingleton(emailConfig);

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, AppUserClaimsPrincipalFactory>();

builder.Services.Configure<DataProtectionTokenProviderOptions>(options => options.TokenLifespan = TimeSpan.FromHours(3));

builder.Services.AddDbContext<AppDbContext>(options =>
             options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IRepository, Repository>();

// Add Google Cloud NLP API service registration
var googleCloudSettings = builder.Configuration.GetSection("GoogleCloudSettings");
var apiKey = googleCloudSettings["ApiKey"];
builder.Services.AddSingleton<INlpService>(new GoogleNlpApiClient(apiKey));

var app = builder.Build();

// Data Seeding
using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;
  var dbContext = services.GetRequiredService<AppDbContext>();
  //lINE 85-86 Is for seeding data, it needs some tweaks, it will be fully implemented at a later stage
  //var dbSeeder = new DBSeeder(dbContext); 
  //dbSeeder.SeedData(dbContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseRouting(); // Add this line to enable routing

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
  endpoints.MapControllers();
});

app.Run();
