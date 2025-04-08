using System.ComponentModel.DataAnnotations;

namespace App.StudentApi.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required,
            StringLength(20, MinimumLength = 2)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 2)]
        public string LastName { get; set; }
        [Required]
        public int No { get; set; }
        [Required]
        public string Class { get; set; }
    }
}
