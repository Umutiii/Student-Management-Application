using App.StudentApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.StudentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private static List<Student> _students = new()
        {
            new Student { Id = 1, FirstName = "Umut", LastName = "GÜNDÜZ", No = 2, Class = "1/A" },
            new Student { Id = 2, FirstName = "Zeynep", LastName = "YILMAZ", No = 5, Class = "1/A" },
            new Student { Id = 3, FirstName = "Ahmet", LastName = "KAYA", No = 7, Class = "1/B" },
            new Student { Id = 4, FirstName = "Elif", LastName = "DEMİR", No = 3, Class = "1/A" },
            new Student { Id = 5, FirstName = "Mehmet", LastName = "ÇELİK", No = 9, Class = "1/B" },
            new Student { Id = 6, FirstName = "Ayşe", LastName = "ARSLAN", No = 1, Class = "1/C" },
            new Student { Id = 7, FirstName = "Burak", LastName = "KOÇ", No = 4, Class = "1/C" },
        };
        private static int _id = 2;

        [HttpGet]
        public IActionResult GetAllStudents()
        {
            return Ok(_students);
        }


        [HttpGet("{id}")]
        public IActionResult GetOneStudent([FromRoute] int id)
        {
            var student = _students.Find(s => s.Id == id);

            if (student is null)
            {
                return NotFound();
            }
            return Ok(student);
        }

        [HttpPost]
        public IActionResult RegisterStudent([FromForm] Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_students.Any(s => s.No == student.No) || student.No < 1)
            {
                student.No = GenerateUniqueStudentNumber();
            }
            student.Id = _id;
            _id++;

            _students.Add(student);
            return Created(string.Empty, student.No);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAStudent([FromRoute] int id, [FromBody] Student student)
        {
            int index = _students.FindIndex(s => s.Id == id);
            if (index == -1)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (_students.Any(s => s.No == student.No) && student.No != _students[index].No || student.No < 1)
            {
                student.No = GenerateUniqueStudentNumber();
            }
            student.Id = id;
            _students[index] = student;
            return Ok();

        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAStudent([FromRoute] int id)
        {
            int index = _students.FindIndex(s => s.Id == id);
            if (index == -1)
            {
                return NotFound();
            }
            _students.RemoveAt(index);
            return Ok();

        }




        [NonAction]
        private int GenerateUniqueStudentNumber()
        {
            int no = 0;
            for (int i = 1; i <= 5000; i++)
            {
                if (!_students.Any(x => x.No == i))
                {
                    no = i;
                    break;
                }
            }
            return no;
        }
    }
}
