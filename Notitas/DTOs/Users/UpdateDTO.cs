namespace Users.DTO
{
    public class UserUpdate
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
    }
    public class PasswordChange
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
        public required string ConfirmPassword { get;  set; }
    }
}