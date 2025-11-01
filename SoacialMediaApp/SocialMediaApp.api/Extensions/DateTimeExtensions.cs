namespace SocialMediaApp.api.Extensions;

public static class DateTimeExtensions
{
    public static int CalculateAge(this DateOnly birthDate)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var age = today.Year - birthDate.Year;
        if (birthDate > today.AddYears(-age))
        {
            age--;
        }
        return age;
    }
}