namespace Users.Model
{
    public class User
    {
        public int? Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public bool IsActive { get; set; }

        public List<Notitas.Model.Notita> Notitas { get; set; } = new();
    }
}