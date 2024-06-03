# **ASP.NET Core Backend development guide**

Understanding the basics of backend development is crucial for building robust and scalable applications. Here’s an overview of the key concepts and components involved:

### 1. **Servers**

- **Role of a Server:** A server is a system that hosts your application and responds to client requests.
- **Web Server Software:** Common web servers include IIS (Internet Information Services), Apache, and Nginx.
- **Server-side vs Client-side:** Server-side operations handle data processing, business logic, and database interactions, while client-side operations handle user interface and experience.

### 2. **Databases**

- **Types of Databases:**
  - **Relational Databases:** Use structured query language (SQL) and store data in tables (e.g., SQL Server, MySQL, PostgreSQL).
  - **NoSQL Databases:** Use various data models like document, key-value, graph, or column (e.g., MongoDB, Redis).
- **Database Operations:** CRUD operations (Create, Read, Update, Delete) are fundamental to interacting with databases.
- **ORM (Object-Relational Mapping):** Tools like Entity Framework (for .NET) map objects in your code to database tables.

### 3. **APIs (Application Programming Interfaces)**

- **RESTful APIs:** Use standard HTTP methods (GET, POST, PUT, DELETE) to interact with resources.
- **Endpoints:** URLs that represent various resources in your application.
- **Request and Response:** Clients send requests to the server, and the server responds with data or a status code.

### 4. **HTTP Protocol**

- **HTTP Methods:**
  - **GET:** Retrieve data.
  - **POST:** Send data to the server.
  - **PUT:** Update existing data.
  - **DELETE:** Remove data.
- **Status Codes:** Indicate the result of an HTTP request (e.g., 200 OK, 404 Not Found, 500 Internal Server Error).

### 5. **Authentication and Authorization**

- **Authentication:** Verifying the identity of a user (e.g., using login credentials).
- **Authorization:** Determining what an authenticated user is allowed to do (e.g., access control).
- **Common Methods:**
  - **Session-based:** Store user session information on the server.
  - **Token-based:** Use tokens (like JWT) for stateless authentication.

### 6. **Middleware**

- **Definition:** Software components that process requests and responses in a pipeline.
- **Examples:** Logging, authentication, error handling.

### 7. **Business Logic**

- **Role:** The core functionality that handles the data processing, calculations, and decision-making in your application.
- **Separation of Concerns:** Keep business logic separate from data access and presentation logic to maintain a clean and manageable codebase.

### 8. **Deployment**

- **Hosting:** Deploy your application on a server or cloud platform.
- **CI/CD:** Continuous Integration and Continuous Deployment pipelines automate the building, testing, and deploying of your application.

### 9. **Version Control**

- **Git:** A distributed version control system to manage changes to your codebase.
- **Repositories:** Central locations where your code is stored and managed (e.g., GitHub, GitLab).

### Practical Steps to Get Started

1. **Set Up Development Environment:** Install necessary software like Visual Studio, .NET SDK, and a database management tool (e.g., SQL Server Management Studio).
2. **Build a Simple Application:**
   - Create a basic ASP.NET Core project.
   - Implement a few API endpoints (e.g., to manage a list of items).
   - Connect the application to a database using Entity Framework Core.
3. **Learn by Doing:** Follow tutorials and build small projects to solidify your understanding.
4. **Explore Official Documentation:** Microsoft’s .NET documentation is comprehensive and a valuable resource.

By focusing on these fundamental concepts and gradually building your skills, you’ll be well on your way to mastering backend development with .NET.

---

This example will cover setting up a basic ASP.NET Core project, creating a model, setting up a database context with Entity Framework Core, and creating a controller with an endpoint to get all users.

### Step 1: Set Up the Project

1. **Create a New ASP.NET Core Project**

   ```sh
   dotnet new webapi -n UserApi
   cd UserApi
   ```

2. **Install Entity Framework Core Packages**
   ```sh
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   dotnet add package Microsoft.EntityFrameworkCore.Tools
   ```

### Step 2: Create the User Model

Create a `User` class in the `Models` folder.

```csharp
// Models/User.cs
namespace UserApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
```

### Step 3: Set Up the Database Context

Create a `UserContext` class in the `Data` folder.

```csharp
// Data/UserContext.cs
using Microsoft.EntityFrameworkCore;
using UserApi.Models;

namespace UserApi.Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
```

### Step 4: Configure the Database Connection

Modify the `appsettings.json` file to include your database connection string.

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UserDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Step 5: Configure Services in `Startup.cs`

Modify the `Startup.cs` file to add the `UserContext` to the service container.

```csharp
// Startup.cs
using Microsoft.EntityFrameworkCore;
using UserApi.Data;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddDbContext<UserContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

### Step 6: Create the Users Controller

Create a `UsersController` in the `Controllers` folder.

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
```

### Step 7: Apply Migrations and Update the Database

1. **Create the Initial Migration**

   ```sh
   dotnet ef migrations add InitialCreate
   ```

2. **Update the Database**
   ```sh
   dotnet ef database update
   ```

### Step 8: Run the Application

Run your application to start the API.

```sh
dotnet run
```

### Testing the API

You can test your API using a tool like Postman or simply navigate to `https://localhost:5001/api/users` in your browser to see the list of users.

This example sets up a basic ASP.NET Core API to get all users from a database. You can extend it by adding more endpoints, handling errors, implementing authentication, and more.

---

To add functionality for adding a user to the existing project, you need to:

1. Add a POST endpoint in the `UsersController`.
2. Create a data transfer object (DTO) if necessary.
3. Update the controller to handle the POST request and save the user to the database.

### Step 1: Create a User DTO (Optional)

A DTO (Data Transfer Object) is useful if you want to separate the internal data model from the data exposed by the API. This is optional but recommended for larger projects.

```csharp
// Models/UserDto.cs
namespace UserApi.Models
{
    public class UserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
```

### Step 2: Update the Users Controller

Modify the `UsersController` to include a POST endpoint for adding a new user.

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }
    }
}
```

### Step 3: Configure JSON Serialization

Ensure that your project is correctly configured to handle JSON serialization. This is typically already set up in ASP.NET Core projects, but you can double-check in `Startup.cs`.

```csharp
// Startup.cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = null;
        });

        services.AddDbContext<UserContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

### Step 4: Test the POST Endpoint

You can test the POST endpoint using a tool like Postman or by writing a simple HTTP client in C#.

#### Using Postman

1. Set the URL to `https://localhost:5001/api/users`.
2. Set the method to POST.
3. In the Body tab, choose raw and JSON, then enter the user data:
   ```json
   {
     "Name": "John Doe",
     "Email": "john.doe@example.com"
   }
   ```
4. Send the request.

#### Using C# HttpClient

Here’s an example of how to test the POST endpoint using an HttpClient in a console application:

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace UserApiClient
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var user = new
            {
                Name = "John Doe",
                Email = "john.doe@example.com"
            };

            var json = JsonConvert.SerializeObject(user);
            var data = new StringContent(json, Encoding.UTF8, "application/json");

            using var client = new HttpClient();
            var response = await client.PostAsync("https://localhost:5001/api/users", data);

            string result = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(result);
        }
    }
}
```

This setup will allow you to add new users to your database through a POST request to the `/api/users` endpoint. Make sure to handle validation and error cases as needed for a production-ready application.

---

To add functionality for updating a user in your existing project, you need to:

1. Add a PUT endpoint in the `UsersController`.
2. Implement the update logic in the controller.
3. Optionally, handle validation to ensure the user exists before updating.

### Step 1: Update the Users Controller

Modify the `UsersController` to include a PUT endpoint for updating an existing user.

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Name = userDto.Name;
            user.Email = userDto.Email;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_context.Users.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
```

### Step 2: Test the PUT Endpoint

You can test the PUT endpoint using a tool like Postman or by writing a simple HTTP client in C#.

#### Using Postman

1. Set the URL to `https://localhost:5001/api/users/{id}` (replace `{id}` with the actual user ID).
2. Set the method to PUT.
3. In the Body tab, choose raw and JSON, then enter the updated user data:
   ```json
   {
     "Name": "Jane Doe",
     "Email": "jane.doe@example.com"
   }
   ```
4. Send the request.

#### Using C# HttpClient

Here’s an example of how to test the PUT endpoint using an HttpClient in a console application:

```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace UserApiClient
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var user = new
            {
                Name = "Jane Doe",
                Email = "jane.doe@example.com"
            };

            var json = JsonConvert.SerializeObject(user);
            var data = new StringContent(json, Encoding.UTF8, "application/json");

            using var client = new HttpClient();
            var response = await client.PutAsync("https://localhost:5001/api/users/1", data);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("User updated successfully.");
            }
            else
            {
                Console.WriteLine($"Error: {response.StatusCode}");
            }
        }
    }
}
```

### Additional Considerations

- **Validation:** Add validation to ensure that the user data being sent is valid.
- **Error Handling:** Improve error handling to manage cases such as database update failures or invalid input.
- **Partial Updates:** For partial updates, consider using the PATCH method and supporting partial update logic.

This setup will allow you to update existing users in your database through a PUT request to the `/api/users/{id}` endpoint. Make sure to further refine and secure your API for production use.

---

To add functionality for deleting a user in your existing project, you need to:

1. Add a DELETE endpoint in the `UsersController`.
2. Implement the delete logic in the controller.
3. Optionally, handle validation to ensure the user exists before deleting.

### Step 1: Update the Users Controller

Modify the `UsersController` to include a DELETE endpoint for deleting an existing user.

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Name = userDto.Name;
            user.Email = userDto.Email;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_context.Users.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
```

### Step 2: Test the DELETE Endpoint

You can test the DELETE endpoint using a tool like Postman or by writing a simple HTTP client in C#.

#### Using Postman

1. Set the URL to `https://localhost:5001/api/users/{id}` (replace `{id}` with the actual user ID).
2. Set the method to DELETE.
3. Send the request.

#### Using C# HttpClient

Here’s an example of how to test the DELETE endpoint using an HttpClient in a console application:

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace UserApiClient
{
    class Program
    {
        static async Task Main(string[] args)
        {
            using var client = new HttpClient();
            var response = await client.DeleteAsync("https://localhost:5001/api/users/1");

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("User deleted successfully.");
            }
            else
            {
                Console.WriteLine($"Error: {response.StatusCode}");
            }
        }
    }
}
```

### Additional Considerations

- **Validation:** Add validation to ensure that the user ID being sent is valid.
- **Error Handling:** Improve error handling to manage cases such as database update failures or invalid input.
- **Soft Delete:** Consider implementing a soft delete by adding a `IsDeleted` flag to the user instead of permanently deleting the record.

This setup will allow you to delete existing users from your database through a DELETE request to the `/api/users/{id}` endpoint. Make sure to further refine and secure your API for production use.

---

To add authentication using JWT (JSON Web Tokens) in your ASP.NET Core project, follow these steps:

### Step 1: Install Necessary Packages

Install the following NuGet packages:

```sh
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.IdentityModel.Tokens
```

### Step 2: Configure JWT Authentication

Update the `appsettings.json` file to include JWT settings:

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UserDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKey12345",
    "Issuer": "YourIssuer",
    "Audience": "YourAudience"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Step 3: Update Startup Configuration

Update the `Startup.cs` file to configure JWT authentication:

```csharp
// Startup.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();

        var jwtSettings = Configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings.GetValue<string>("SecretKey");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
                ValidAudience = jwtSettings.GetValue<string>("Audience"),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
            };
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

### Step 4: Create a User Authentication Service

Create a service to handle user authentication and JWT token generation.

```csharp
// Services/AuthService.cs
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserApi.Models;

namespace UserApi.Services
{
    public interface IAuthService
    {
        string Authenticate(UserDto user);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Authenticate(UserDto user)
        {
            // TODO: Validate the user credentials against your data source
            // For demonstration, assuming a valid user

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings.GetValue<string>("SecretKey");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = jwtSettings.GetValue<string>("Issuer"),
                Audience = jwtSettings.GetValue<string>("Audience"),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
```

### Step 5: Create an Authentication Controller

Create a new controller for handling authentication requests.

```csharp
// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using UserApi.Models;
using UserApi.Services;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserDto userDto)
        {
            var token = _authService.Authenticate(userDto);
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized();
            }

            return Ok(new { Token = token });
        }
    }
}
```

### Step 6: Register the Authentication Service

Register the authentication service in the `Startup.cs` file.

```csharp
// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();

    var jwtSettings = Configuration.GetSection("JwtSettings");
    var secretKey = jwtSettings.GetValue<string>("SecretKey");

    services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
            ValidAudience = jwtSettings.GetValue<string>("Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

    services.AddScoped<IAuthService, AuthService>();
}
```

### Step 7: Protect Endpoints with Authentication

Update your existing controllers to protect endpoints with the `[Authorize]` attribute.

```csharp
// Controllers/UsersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserApi.Data;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;

        public UsersController(UserContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Name = userDto.Name;
            user.Email = userDto.Email;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!_context.Users.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
```

### Testing the Authentication

#### 1. Register/Login a User

Use Postman or a similar tool to test the authentication:

1. **Register/Login Endpoint**: `https://localhost:5001/api/auth/login`
2. **Method**: POST
3. **Body** (raw JSON):
   ```json
   {
     "Name": "John Doe",
     "Email": "john.doe@example.com"
   }
   ```

#### 2. Access Protected Endpoints

1. **Get Token**: Copy the token returned from the login endpoint.
2. **Access Endpoint**: Use the token to access a protected endpoint like `https://localhost:5001/api/users`.
3. **Authorization Header**: Set the `Authorization` header with the value `Bearer <your_token>`.

---

Swagger provides a user-friendly interface for exploring your API endpoints and testing them. Here's how you can integrate Swagger into your ASP.NET Core project:

### Step 1: Install the Swagger NuGet Package

Install the following NuGet packages:

```sh
dotnet add package Swashbuckle.AspNetCore
```

### Step 2: Configure Swagger in Startup

Update the `Startup.cs` file to configure Swagger.

```csharp
// Startup.cs
using Microsoft.OpenApi.Models;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();

        var jwtSettings = Configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings.GetValue<string>("SecretKey");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
                ValidAudience = jwtSettings.GetValue<string>("Audience"),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
            };
        });

        services.AddScoped<IAuthService, AuthService>();

        // Add Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "User API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme (Example: 'Bearer 12345abcdef')",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement{
              {
                new OpenApiSecurityScheme{
                  Reference = new OpenApiReference{
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                  }
                },
                new string[]{}
              }
            });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // Enable middleware to serve generated Swagger as a JSON endpoint
        app.UseSwagger();

        // Enable middleware to serve Swagger UI (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
            c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
        });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

### Step 3: Annotate Your Controllers

Use XML comments to provide additional information about your API endpoints. First, enable XML comments in your project.

1. Open the `.csproj` file and add the following:

   ```xml
   <PropertyGroup>
     <GenerateDocumentationFile>true</GenerateDocumentationFile>
     <NoWarn>$(NoWarn);1591</NoWarn>
   </PropertyGroup>
   ```

2. Annotate your controllers and actions with XML comments. For example:

   ```csharp
   // Controllers/UsersController.cs
   using Microsoft.AspNetCore.Authorization;
   using Microsoft.AspNetCore.Mvc;
   using Microsoft.EntityFrameworkCore;
   using System.Collections.Generic;
   using System.Linq;
   using System.Threading.Tasks;
   using UserApi.Data;
   using UserApi.Models;

   namespace UserApi.Controllers
   {
       [Route("api/[controller]")]
       [ApiController]
       [Authorize]
       public class UsersController : ControllerBase
       {
           private readonly UserContext _context;

           public UsersController(UserContext context)
           {
               _context = context;
           }

           /// <summary>
           /// Gets all users.
           /// </summary>
           /// <returns>A list of users.</returns>
           [HttpGet]
           public async Task<ActionResult<IEnumerable<User>>> GetUsers()
           {
               return await _context.Users.ToListAsync();
           }

           /// <summary>
           /// Adds a new user.
           /// </summary>
           /// <param name="userDto">The user to add.</param>
           /// <returns>The created user.</returns>
           [HttpPost]
           public async Task<ActionResult<User>> PostUser(UserDto userDto)
           {
               var user = new User
               {
                   Name = userDto.Name,
                   Email = userDto.Email
               };

               _context.Users.Add(user);
               await _context.SaveChangesAsync();

               return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
           }

           /// <summary>
           /// Updates an existing user.
           /// </summary>
           /// <param name="id">The user ID.</param>
           /// <param name="userDto">The updated user.</param>
           /// <returns>No content.</returns>
           [HttpPut("{id}")]
           public async Task<IActionResult> PutUser(int id, UserDto userDto)
           {
               var user = await _context.Users.FindAsync(id);

               if (user == null)
               {
                   return NotFound();
               }

               user.Name = userDto.Name;
               user.Email = userDto.Email;

               _context.Entry(user).State = EntityState.Modified;

               try
               {
                   await _context.SaveChangesAsync();
               }
               catch (DbUpdateConcurrencyException) when (!_context.Users.Any(e => e.Id == id))
               {
                   return NotFound();
               }

               return NoContent();
           }

           /// <summary>
           /// Deletes a user.
           /// </summary>
           /// <param name="id">The user ID.</param>
           /// <returns>No content.</returns>
           [HttpDelete("{id}")]
           public async Task<IActionResult> DeleteUser(int id)
           {
               var user = await _context.Users.FindAsync(id);

               if (user == null)
               {
                   return NotFound();
               }

               _context.Users.Remove(user);
               await _context.SaveChangesAsync();

               return NoContent();
           }
       }
   }
   ```

### Step 4: Test Swagger

Run your application and navigate to `https://localhost:5001/swagger` to see the Swagger UI. You should see all your API endpoints documented and be able to test them directly from the UI.

### Summary

By integrating Swagger into your ASP.NET Core project, you've added a powerful tool for documenting and testing your API. This enhancement not only makes your project more professional but also improves the developer experience by providing clear, interactive documentation.
