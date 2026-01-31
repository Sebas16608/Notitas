namespace Users.DTO
{
    public class UserReadFull
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
    }
}